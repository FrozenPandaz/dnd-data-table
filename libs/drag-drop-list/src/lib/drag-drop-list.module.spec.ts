import { async, TestBed } from '@angular/core/testing';
import { DragDropListModule } from './drag-drop-list.module';

describe('DragDropListModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DragDropListModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(DragDropListModule).toBeDefined();
  });
});
