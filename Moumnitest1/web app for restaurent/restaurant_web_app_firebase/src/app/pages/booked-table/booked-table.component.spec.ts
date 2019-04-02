import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookedTableComponent } from './booked-table.component';

describe('BookedTableComponent', () => {
  let component: BookedTableComponent;
  let fixture: ComponentFixture<BookedTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookedTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookedTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
