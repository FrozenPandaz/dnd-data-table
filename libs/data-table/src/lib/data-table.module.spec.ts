import { async, TestBed } from '@angular/core/testing';
import { DataTableModule } from './data-table.module';

describe('DataTableModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DataTableModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(DataTableModule).toBeDefined();
  });
});
