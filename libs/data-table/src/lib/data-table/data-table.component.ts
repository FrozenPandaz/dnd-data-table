import { Component } from '@angular/core';
import {
  CdkDragDrop, CdkDragEnd,
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
  {id: 0, type: 'FOLDER', name: 'Elements'},
  {id: 10, type: 'FILE', name: 'Sodium'},
];

const elements: Array<File|Folder> = [
  {id: 1, type: 'FILE', name: 'Hydrogen'},
  {id: 2, type: 'FILE', name: 'Helium'},
  {id: 3, type: 'FILE', name: 'Lithium'},
  {id: 4, type: 'FILE', name: 'Beryllium'},
  {id: 5, type: 'FILE', name: 'Boron'},
  {id: 6, type: 'FILE', name: 'Carbon'},
  {id: 7, type: 'FILE', name: 'Nitrogen'},
  {id: 8, type: 'FILE', name: 'Oxygen'},
  {id: 9, type: 'FILE', name: 'Fluorine'},
  {id: 10, type: 'FILE', name: 'Neon'},
]


@Component({
  selector: 'demo-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent {
  displayedColumns: string[] = ['expand', 'type', 'name'];
  private items = items;
  dataSource = new BehaviorSubject<Array<File|Folder>>(this.items);

  private state = [];

  expanded = {
    0: false
  }

  private _itemRecs: (ClientRect | DOMRect)[] = [];

  onDrop(event: CdkDragDrop<Array<File|Folder>>) {
    const previousIndex = this.items.findIndex(item => item === event.item.data);
    moveItemInArray(this.items, previousIndex, event.currentIndex);
    this.dataSource.next(this.items);
  }

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

  onItemDropped(event: CdkDragEnd) {
    console.log(this.state);
    const [offset, index] = this.state;
    const previousIndex = this.items.findIndex(item => item === event.source.data);
    if (offset === 0) {
      elements.push(event.source.data);
      this.items.splice(this.items.indexOf(event.source.data), 1);
    } else {
      moveItemInArray(this.items, previousIndex, index + offset);
    }
    event.source.reset();
    this.dataSource.next(this.items);
  }
  
  onItemDragStart(event: CdkDragStart) {
    this._itemRecs = Array.from(event.source.element.nativeElement.parentElement.querySelectorAll('[cdkdrag]')).map(item => item.getBoundingClientRect());
  }

  onItemMoved(event: CdkDragMove) {
    const buffer = 8;
    if (event.pointerPosition.y < Math.floor(this._itemRecs[0].top)) {
      this.state = [-1, 0];
      return;
    }
    if (event.pointerPosition.y > Math.floor(this._itemRecs[this._itemRecs.length - 1].bottom)) {
      this.state = [1, this._itemRecs.length - 1];
      return;
    }
    const index = this._itemRecs.findIndex(rect => {
      return event.pointerPosition.y <= Math.floor(rect.bottom) && event.pointerPosition.y >= Math.floor(rect.top)
    });
    if (event.pointerPosition.y >= Math.floor(this._itemRecs[index].bottom) - buffer) {
      this.state = [1, index];
    } else if (event.pointerPosition.y <= Math.floor(this._itemRecs[index].top) + buffer) {
      this.state = [-1, index];
    } else {
      this.state = [0, index];
    }
  }

  onItemDroppedIntoFolder(event) {
    console.log('DROPPED', event);
  }
}
