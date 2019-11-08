import {
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
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
import { filter } from 'rxjs/operators';

@Directive({
  selector: '[demoDragDropList]',
  exportAs: 'demoDragDropList'
})
export class DragDropListDirective<T> extends CdkDropList<T> implements OnInit {
  private originalSortItem;
  private _sortDisabled: boolean;

  @Input()
  dragPredicate: (item: T) => boolean;

  @Input()
  dropBuffer = 8;

  @ContentChildren(CdkDrag)
  children: QueryList<CdkDrag>;

  private hoveredItem: ElementRef;

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
    this.dropped.subscribe(e => {
      if (this._sortDisabled) {
        this.dropDragListDrop.emit(e);
      } else {
        this.dropDragListSort.emit(e);
      }
      this.reset();
    });
  }

  private listenForClasses() {
    this._dropListRef.beforeStarted.subscribe(() => {
      this.element.nativeElement.classList.add('cdk-drop-list-dragging');
    });
    this._dropListRef.dropped.subscribe(() => {
      this.element.nativeElement.classList.remove('cdk-drop-list-dragging');
    });
  }

  private patchSort() {
    this.originalSortItem = this._dropListRef._sortItem;
    this._dropListRef._sortItem = (...args) => this.sortItem(...args);
  }

  private reset() {
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
    const siblings = (<any>this._dropListRef)._itemPositions;
    const newIndex = (<any>this._dropListRef)._getItemIndexFromPointerPosition(
      item,
      pointerX,
      pointerY,
      pointerDelta
    );
    if (newIndex === -1 && siblings.length > 0) {
      return;
    }

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
      pointerY,
      pointerDelta
    );
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
}
