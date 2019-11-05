import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
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

const data: Array<File | Folder> = [
  { id: 1, type: 'FILE', name: 'Hydrogen' },
  { id: 2, type: 'FILE', name: 'Helium' },
  { id: 3, type: 'FILE', name: 'Lithium' },
  { id: 4, type: 'FILE', name: 'Beryllium' },
  { id: 0, type: 'FOLDER', name: 'Elements' },
  { id: 5, type: 'FILE', name: 'Boron' },
  { id: 6, type: 'FILE', name: 'Carbon' },
  { id: 7, type: 'FILE', name: 'Nitrogen' },
  { id: 8, type: 'FILE', name: 'Oxygen' },
  { id: 9, type: 'FILE', name: 'Fluorine' },
  { id: 10, type: 'FILE', name: 'Sodium' }
];

let items: Array<File | Folder> = [];

for (let i = 0; i < 300; i++) {
  items = items.concat(data);
}

const elements: Array<File | Folder> = [];

@Component({
  selector: 'demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  items = items;
  data = new BehaviorSubject(this.items);
  columns = ['type', 'name'];
  isFolder(item: File | Folder) {
    return item.type === 'FOLDER';
  }

  onDrop(event: CdkDragDrop<File | Folder>) {
    const previousIndex = this.items.indexOf(event.item.data);
    this.items.splice(previousIndex, 1);
    elements.push(event.item.data);
    this.data.next(this.items);
  }

  onSort(event: CdkDragDrop<File | Folder>) {
    const previousIndex = this.items.indexOf(event.item.data);
    if (event.currentIndex === previousIndex) {
      return;
    }
    console.log(previousIndex, event.currentIndex);
    moveItemInArray(this.items, previousIndex, event.currentIndex);
    this.data.next(this.items);
  }
}
