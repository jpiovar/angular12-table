import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableBaseExtendedComponent } from './table-base-extended.component';

describe('TableBaseExtendedComponent', () => {
  let component: TableBaseExtendedComponent;
  let fixture: ComponentFixture<TableBaseExtendedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableBaseExtendedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableBaseExtendedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
