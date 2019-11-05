import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropListDirective } from './drag-drop-list.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [DragDropListDirective],
  exports: [DragDropListDirective]
})
export class DragDropListModule {}
