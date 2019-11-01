import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule } from '@angular/material/table';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { DemoDataTableComponent } from './data-table/data-table.component';

@NgModule({
  imports: [CommonModule, MatTableModule, DragDropModule],
  exports: [DemoDataTableComponent],
  declarations: [DemoDataTableComponent]
})
export class DataTableModule {}
