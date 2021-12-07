import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusToggleBtnComponent } from './status-toggle-btn.component';

describe('StatusToggleBtnComponent', () => {
  let component: StatusToggleBtnComponent;
  let fixture: ComponentFixture<StatusToggleBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusToggleBtnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusToggleBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
