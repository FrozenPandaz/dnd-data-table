import {
  Component,
  Directive,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {
  CdkDragDrop,
  CdkDragEnd,
  CdkDragMove,
  CdkDragStart,
  CdkDropList,
  moveItemInArray
} from '@angular/cdk/drag-drop';
import { BehaviorSubject } from 'rxjs';
import { DataSource } from '@angular/cdk/collections';
import { MatTable } from '@angular/material/table';

export interface DropEvent<T> {
  previousIndex: number;
  currentIndex: number;
  event: CdkDragEnd;
  render: (data: T[]) => void;
}

interface File {
  type: 'FILE';
  name: string;
  id: number;
}

interface Folder {
  type: 'FOLDER';
  name: string;
  id: number;
}

const items: Array<File | Folder> = [
  { id: 3, type: 'FILE', name: 'Lithium' },
  { id: 4, type: 'FILE', name: 'Beryllium' },
  { id: 0, type: 'FOLDER', name: 'Elements' },
  { id: 5, type: 'FILE', name: 'Boron' },
  { id: 6, type: 'FILE', name: 'Carbon' },
  { id: 7, type: 'FILE', name: 'Nitrogen' },
  { id: 8, type: 'FILE', name: 'Oxygen' },
  { id: 9, type: 'FILE', name: 'Fluorine' },
  { id: 10, type: 'FILE', name: 'Neon' },
  { id: 11, type: 'FILE', name: 'Sodium' }
];

const elements: Array<File | Folder> = [
  { id: 1, type: 'FILE', name: 'Hydrogen' },
  { id: 2, type: 'FILE', name: 'Helium' }
];

@Component({
  selector: 'demo-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
// tslint:disable-next-line:directive-class-suffix
export class DemoDataTableComponent<T> implements OnInit {
  @Input()
  data: T[];
  @Input()
  displayedColumns: string[] = ['type', 'name'];
  @Input()
  dataSource: BehaviorSubject<T[]>;
  @Output()
  sort = new EventEmitter<DropEvent<T>>();
  @Output()
  drop = new EventEmitter<DropEvent<T>>();
  @Input()
  dropBuffer: number;
  @Input()
  dropPredicate: (item: T) => boolean;
  private _itemRecs;
  private currentIndex: number;
  private hoverZone: number;

  ngOnInit() {
    this.dataSource = new BehaviorSubject(this.data);
  }

  onDragStarted(event: CdkDragStart) {
    const nativeElement = event.source.element.nativeElement;
    event.source.element.nativeElement.style.zIndex = '1001';
    this._itemRecs = Array.from(nativeElement.parentElement.children).map(
      node => node.getBoundingClientRect()
    );
  }

  onDragMove(event: CdkDragMove) {
    const nativeElement = event.source.element.nativeElement;
    const previousIndex = this.getPreviousIndex(event);
    this.currentIndex = this.getCurrentIndex(event);

    Array.from(nativeElement.parentElement.children).forEach(
      (elem: HTMLElement, i: number, arr: HTMLElement[]) => {
        if (i === previousIndex) {
          return;
        }
        const direction = this.currentIndex < previousIndex ? 1 : -1;
        if (this.isBetween(i, previousIndex, this.currentIndex)) {
          if (!this.dropPredicate(this.data[this.currentIndex])) {
            this.translateItem(elem, direction);
          } else {
            if (i === this.currentIndex) {
              this.hoverZone = this.getHoverZone(this._itemRecs[i], event);

              if (this.hoverZone === -direction) {
                this.translateItem(elem, direction);
              } else {
                elem.style.transform = null;
              }
            }
          }
        } else {
          elem.style.transform = null;
        }
      }
    );
  }

  onDragEnded(event: CdkDragEnd) {
    const nativeElement = event.source.element.nativeElement;
    const previousIndex = this.getPreviousIndex(event);

    Array.from(nativeElement.parentElement.children).forEach(
      (elem: HTMLElement, i: number, arr: HTMLElement[]) => {
        elem.style.transform = null;
      }
    );
    event.source.reset();
    if (previousIndex === this.currentIndex) {
      return;
    }
    console.log(
      this.dropPredicate(this.data[this.currentIndex]),
      this.hoverZone
    );
    if (
      this.dropPredicate(this.data[this.currentIndex]) &&
      this.hoverZone === 0
    ) {
      this.drop.next({
        previousIndex,
        currentIndex: this.currentIndex,
        render: data => {
          this.dataSource.next(data);
        },
        event
      });
      return;
    }
    this.sort.next({
      previousIndex,
      currentIndex: this.currentIndex,
      render: data => {
        this.dataSource.next(data);
      },
      event
    });
  }

  private translateItem(elem: HTMLElement, direction: 1 | -1) {
    const transformDistance = this.getTransformDistance(elem, direction);
    elem.style.transform = `translate3d(0, ${transformDistance}px, 0)`;
  }

  private getTransformDistance(elem: HTMLElement, direction: 1 | -1) {
    return (
      direction *
      (direction === 1
        ? elem.nextElementSibling
        : elem.previousElementSibling
      ).getBoundingClientRect().height
    );
  }

  private getPreviousIndex(event: CdkDragMove | CdkDragEnd) {
    return this.data.indexOf(event.source.data);
  }

  private getCurrentIndex(event: CdkDragMove) {
    let index: number;
    if (this.isAbove(this._itemRecs[0], event)) {
      index = 0;
    } else if (this.isBelow(this._itemRecs[this._itemRecs.length - 1], event)) {
      index = this._itemRecs.length - 1;
    } else {
      return this._itemRecs.findIndex(rect => this.isWithin(rect, event));
    }
    return index;
  }

  private getHoverZone(rect: ClientRect | DOMRect, event: CdkDragMove) {
    const pointerY = event.pointerPosition.y;

    if (pointerY - Math.floor(rect.top) < this.dropBuffer) {
      return -1;
    }

    if (Math.ceil(rect.bottom) - pointerY < this.dropBuffer) {
      return 1;
    }

    return 0;
  }

  private isWithin(rect: ClientRect | DOMRect, event: CdkDragMove) {
    const pointerY = event.pointerPosition.y;
    return (
      pointerY <= Math.floor(rect.bottom) && pointerY >= Math.floor(rect.top)
    );
  }

  private isBelow(rect: ClientRect | DOMRect, event: CdkDragMove) {
    const pointerY = event.pointerPosition.y;
    return pointerY >= Math.floor(rect.bottom);
  }

  private isAbove(rect: ClientRect | DOMRect, event: CdkDragMove) {
    const pointerY = event.pointerPosition.y;
    return pointerY <= Math.floor(rect.top);
  }

  private isBetween(a: number, b: number, c: number) {
    return (b < c && a > b && a <= c) || (b > c && a < b && a >= c);
  }
}
