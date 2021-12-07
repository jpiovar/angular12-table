import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableExtendedComponent } from './table-extended.component';

describe('TableExtendedComponent', () => {
  let component: TableExtendedComponent;
  let fixture: ComponentFixture<TableExtendedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableExtendedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableExtendedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
