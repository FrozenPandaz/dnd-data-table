import {
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList
} from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  DragRef
} from '@angular/cdk/drag-drop';
import { takeUntil } from 'rxjs/operators';
import { interval, Subject } from 'rxjs';

@Directive({
  selector: '[demoDragDropList]',
  exportAs: 'demoDragDropList'
})
export class DragDropListDirective<T> extends CdkDropList<T>
  implements OnInit, OnDestroy {
  private originalSortItem;
  private _sortDisabled: boolean;

  private onDestroy$ = new Subject();

  @Input()
  dragPredicate: (item: T) => boolean = () => false;

  @Input()
  dropBuffer = 8;

  @ContentChildren(CdkDrag)
  children: QueryList<CdkDrag>;

  private hoveredItem: ElementRef;
  private scrollParent: HTMLElement;

  private get scrollOffset() {
    return this.hasScrolled ? this.scrollParent.scrollTop : 0;
  }

  private dScrollOffset = 0;
  private hasScrolled = false;
  private scrolling = false;
  private stopScrollingSubject = new Subject();

  @Input('demoDragDropListData')
  set demoDragDropListData(data: T) {
    this.data = data;
  }

  @Input('demoDragDropListLockAxis')
  set demoDragDropListLockAxis(axis: 'x' | 'y') {
    this.lockAxis = axis;
  }

  @Output()
  dropDragListSort = new EventEmitter<CdkDragDrop<T, any>>();

  @Output()
  dropDragListDrop = new EventEmitter<CdkDragDrop<T, any>>();

  ngOnInit() {
    this.patchSort();
    this.listenForClasses();
    this.dropped.pipe(takeUntil(this.onDestroy$)).subscribe(e => {
      this.stopScrolling();
      if (this._sortDisabled) {
        this.dropDragListDrop.emit(e);
      } else {
        this.dropDragListSort.emit(e);
      }
      this.reset();
    });
  }

  private listenForClasses() {
    this._dropListRef.beforeStarted
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.element.nativeElement.classList.add('cdk-drop-list-dragging');
      });
    this._dropListRef.dropped.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      this.element.nativeElement.classList.remove('cdk-drop-list-dragging');
    });
  }

  private patchSort() {
    this.originalSortItem = this._dropListRef._sortItem;
    this._dropListRef._sortItem = (...args) => this.sortItem(...args);
  }

  private reset() {
    this.hasScrolled = false;
    this.dScrollOffset = 0;
    if (!this.hoveredItem) {
      return;
    }
    this.hoveredItem.nativeElement.classList.remove('drag-drop-list-hover');
  }

  sortItem(
    item: DragRef<any>,
    pointerX: number,
    pointerY: number,
    pointerDelta: {
      x: number;
      y: number;
    }
  ) {
    this.scrollIfNecessary(pointerX, pointerY);

    const siblings = (<any>this._dropListRef)._itemPositions;
    const newIndex = (<any>this._dropListRef)._getItemIndexFromPointerPosition(
      item,
      pointerX,
      pointerY + this.scrollOffset,
      pointerDelta
    );
    console.log(newIndex);
    if (newIndex === -1 && siblings.length > 0) {
      return;
    }

    siblings.forEach((sibling, i) => {
      if (i !== newIndex) {
        sibling.drag.data.element.nativeElement.classList.remove(
          'drag-drop-list-hover'
        );
      }
    });

    if (this.dragPredicate(siblings[newIndex].drag.data.data)) {
      const hoverZone = this.getHoverZone(
        siblings[newIndex].clientRect,
        pointerY
      );
      this._sortDisabled = false;
      if (hoverZone === 0) {
        this.hoveredItem = siblings[newIndex].drag.data.element;
        this.hoveredItem.nativeElement.classList.add('drag-drop-list-hover');
        this._sortDisabled = true;
      } else {
        siblings[newIndex].drag.data.element.nativeElement.classList.remove(
          'drag-drop-list-hover'
        );
        this._sortDisabled = false;
      }
      if (hoverZone !== pointerDelta.y) {
        return;
      }
    } else {
      this._sortDisabled = false;
    }

    this.originalSortItem.bind(this._dropListRef)(
      item,
      pointerX,
      pointerY + this.dScrollOffset,
      pointerDelta
    );
  }

  private scrollIfNecessary(x: number, y: number) {
    const findScrollableParent = () => {
      let element = this._dropListRef.element;
      while (element.scrollHeight === element.clientHeight) {
        element = element.parentElement;
      }
      return element;
    };
    this.scrollParent = this.scrollParent || findScrollableParent();
    const scrollRect = this.scrollParent.getBoundingClientRect();
    if ((scrollRect.bottom - y) / scrollRect.height < 0.05) {
      this.startScrolling(5);
    } else if ((y - scrollRect.top) / scrollRect.height < 0.05) {
      this.startScrolling(-5);
    } else {
      this.stopScrolling();
    }
  }

  private startScrolling(distance: number) {
    if (this.scrolling) {
      return;
    }
    this.scrolling = true;
    this.hasScrolled = true;

    interval(10)
      .pipe(takeUntil(this.stopScrollingSubject))
      .subscribe(() => {
        this.scrollParent.scrollBy(0, distance);

        this.dScrollOffset += distance;
      });
  }

  private stopScrolling() {
    if (!this.scrolling) {
      return;
    }
    this.scrolling = false;
    this.stopScrollingSubject.next();
  }

  private getHoverZone(rect: ClientRect | DOMRect, pointerY: number) {
    if (pointerY - Math.floor(rect.top) < this.dropBuffer) {
      return -1;
    }

    // console.log(Math.ceil(rect.bottom), pointerY);
    if (Math.ceil(rect.bottom) - pointerY < this.dropBuffer) {
      return 1;
    }

    return 0;
  }

  ngOnDestroy() {
    this.stopScrolling();
    this.onDestroy$.next();
  }
}
