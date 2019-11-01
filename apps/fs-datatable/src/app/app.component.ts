import { Component } from '@angular/core';
import { DropEvent } from '../../../../libs/data-table/src/lib/data-table/data-table.component';
import { moveItemInArray } from '@angular/cdk/drag-drop';

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
  selector: 'demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  data = items;
  columns = ['type', 'name'];
  isFolder(item: File | Folder) {
    return item.type === 'FOLDER';
  }

  onDrop(event: DropEvent<File | Folder>) {
    if (event.currentIndex === event.previousIndex) {
      return;
    }
    this.data.splice(event.previousIndex, 1);
    elements.push(event.event.source.data);
    event.render(this.data);
  }

  onSort(event: DropEvent<File | Folder>) {
    if (event.currentIndex === event.previousIndex) {
      return;
    }
    moveItemInArray(this.data, event.previousIndex, event.currentIndex);
    event.render(this.data);
  }
}
