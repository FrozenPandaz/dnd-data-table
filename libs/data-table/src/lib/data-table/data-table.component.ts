import { Component } from '@angular/core';
import {
  CdkDragDrop,
  CdkDragEnd,
  CdkDragMove,
  CdkDragSortEvent,
  CdkDragStart,
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

const items: Array<File|Folder> = [
  {id: 0, type: 'FOLDER', name: 'Hydrogen'},
  {id: 1, type: 'FILE', name: 'Helium'},
  {id: 2, type: 'FILE', name: 'Lithium'},
  {id: 3, type: 'FILE', name: 'Beryllium'},
  {id: 4, type: 'FILE', name: 'Boron'},
  {id: 5, type: 'FILE', name: 'Carbon'},
  {id: 6, type: 'FILE', name: 'Nitrogen'},
  {id: 7, type: 'FILE', name: 'Oxygen'},
  {id: 8, type: 'FILE', name: 'Fluorine'},
  { id: 9, type: 'FILE', name: 'Neon'},
];


@Component({
  selector: 'demo-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent {
  displayedColumns: string[] = ['type', 'name'];
  private items = items;
  dataSource = new BehaviorSubject<Array<File|Folder>>(this.items);

  private _itemRecs: (ClientRect | DOMRect)[] = [];

  onDrop(event: CdkDragDrop<Array<File|Folder>>) {
    const previousIndex = this.items.findIndex(item => item === event.item.data);
    moveItemInArray(this.items, previousIndex, event.currentIndex);
    this.dataSource.next(this.items);
  }

  onItemDropped(event: CdkDragEnd) {
    event.source.reset();
  }

  onSorted(event: CdkDragSortEvent) {
  }
  onItemDragStart(event: CdkDragStart) {
    this._itemRecs = Array.from(event.source.element.nativeElement.parentElement.querySelectorAll('[cdkdrag]')).map(item => item.getBoundingClientRect());
  }

  onItemMoved(event: CdkDragMove) {
    const buffer = 16;
    if (event.pointerPosition.y < Math.floor(this._itemRecs[0].top)) {
      console.log('Above', 0);
      return;
    }
    if (event.pointerPosition.y > Math.floor(this._itemRecs[this._itemRecs.length - 1].bottom)) {
      console.log('Below', this._itemRecs.length - 1);
      return;
    }
    const index = this._itemRecs.findIndex(rect => {
      return event.pointerPosition.y <= Math.floor(rect.bottom) && event.pointerPosition.y >= Math.floor(rect.top)
    });
    if (event.pointerPosition.y >= Math.floor(this._itemRecs[index].bottom) - buffer) {
      console.log('Below', index);
    } else if (event.pointerPosition.y <= Math.floor(this._itemRecs[index].top) + buffer) {
      console.log('Above', index);
    } else {
      console.log('Over', index);
    }
  }

  onItemDroppedIntoFolder(event) {
    console.log('DROPED', event);
  }
}
