import { Component, ViewChild } from '@angular/core';
import {
  CdkDragDrop,
  CdkDragEnd,
  CdkDragMove,
  CdkDragStart,
  CdkDropList,
  moveItemInArray
} from '@angular/cdk/drag-drop';
import { BehaviorSubject } from 'rxjs';

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
  { id: 0, type: 'FOLDER', name: 'Elements' },
  { id: 3, type: 'FILE', name: 'Lithium' },
  { id: 4, type: 'FILE', name: 'Beryllium' },
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
export class DataTableComponent {
  displayedColumns: string[] = ['expand', 'type', 'name'];
  private items = items;
  dataSource = new BehaviorSubject<Array<File | Folder>>(this.items);
  expanded = {
    0: false
  };
  private _itemRecs;

  onExpand(folder: Folder) {
    this.expanded[folder.id] = true;
    this.items.splice(this.items.indexOf(folder) + 1, 0, ...elements);
    this.dataSource.next(this.items);
  }

  onCollapse(folder: Folder) {
    this.expanded[folder.id] = false;
    this.items.splice(this.items.indexOf(folder) + 1, elements.length);
    this.dataSource.next(this.items);
  }

  onDropped(event: CdkDragDrop<any>) {
    const previousIndex = this.items.indexOf(event.item.data);
    moveItemInArray(this.items, previousIndex, event.currentIndex);
    this.dataSource.next(this.items);
  }

  onDragStarted(event: CdkDragStart) {
    const nativeElement = event.source.element.nativeElement;
    this._itemRecs = Array.from(nativeElement.parentElement.children).map(
      node => node.getBoundingClientRect()
    );
  }

  onDragMove(event: CdkDragMove) {
    console.log(this.items[this.getCurrentIndex(event)]);
  }

  onDragEnded(event: CdkDragEnd) {
    const nativeElement = event.source.element.nativeElement;
    event.source.reset();
  }

  private getCurrentIndex(event: CdkDragMove) {
    let index: number;
    if (this.isAbove(this._itemRecs[0], event.pointerPosition.y)) {
      index = 0;
    } else if (
      this.isBelow(
        this._itemRecs[this._itemRecs.length - 1],
        event.pointerPosition.y
      )
    ) {
      index = this._itemRecs.length - 1;
    } else {
      index = this._itemRecs.findIndex(rect =>
        this.isWithin(rect, event.pointerPosition.y)
      );
    }
    return index;
  }

  private isWithin(rect: ClientRect | DOMRect, pointerY: number) {
    return (
      pointerY <= Math.floor(rect.bottom) && pointerY >= Math.floor(rect.top)
    );
  }

  private isBelow(rect: ClientRect | DOMRect, pointerY: number) {
    return pointerY >= Math.floor(rect.bottom);
  }

  private isAbove(rect: ClientRect | DOMRect, pointerY: number) {
    return pointerY <= Math.floor(rect.top);
  }
}
