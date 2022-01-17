import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCompletedComponent } from './table-completed.component';

describe('TableCompletedComponent', () => {
  let component: TableCompletedComponent;
  let fixture: ComponentFixture<TableCompletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableCompletedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableCompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
