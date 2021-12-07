import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertNewBtnComponent } from './insert-new-btn.component';

describe('InsertNewBtnComponent', () => {
  let component: InsertNewBtnComponent;
  let fixture: ComponentFixture<InsertNewBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsertNewBtnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertNewBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
