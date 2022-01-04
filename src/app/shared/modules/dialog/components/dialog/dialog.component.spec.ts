import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { Overlay } from '@angular/cdk/overlay';

import { DialogComponent } from './dialog.component';
import { SafeHtmlPipe } from 'src/app/shared/pipes/safe-html.pipe';
// import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;


    const mockDialogRef = {
      close: jasmine.createSpy('close')
    };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        StoreModule.forRoot({}),
        MatDialogModule,
        HttpClientTestingModule
      ],
      providers: [MatDialog, Overlay, SafeHtmlPipe,
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }],
      declarations: [ DialogComponent, SafeHtmlPipe ]
    })
    .compileComponents();
  }));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('dialog should be closed after onYesClick()', () => {
  //   let spy = spyOn(component.dialogRef, 'close').and.callThrough();
  //   component.close();
  //   expect(spy).toHaveBeenCalled();
  // });

  // it('dialog should be closed after onNoClick()', () => {
  //   let spy = spyOn(component.dialogRef, 'close').and.callThrough();
  //   component.submit();
  //   expect(spy).toHaveBeenCalled();
  // });
});
