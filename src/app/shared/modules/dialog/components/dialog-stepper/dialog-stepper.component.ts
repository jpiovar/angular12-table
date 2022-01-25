import { Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dialog-stepper',
  templateUrl: './dialog-stepper.component.html',
  styleUrls: ['./dialog-stepper.component.scss']
})
export class DialogStepperComponent implements OnInit {
  triggerSubmit: Subject<any> = new Subject<any>();

  content: any = {};
  selectedIndex: number = 0;
  recordsNew: any[] = [];
  currentDialogSize: any = { step0: {}, step1: {}, step2: {} };

  submittedRecords: any[] = [];

  @ViewChild('stepper') stepper: MatStepper;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    public dialogStepperRef: MatDialogRef<DialogStepperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogStepperRef.disableClose = true;
  }

  ngOnInit(): void {
    this.initializeContent();
  }

  initializeContent() {
    debugger;
    this.storeInitialSize();
    this.content = this.data;

    console.log(this.content);

    // this.modifiedContent = JSON.parse(JSON.stringify(this.content));

    this.dialogStepperRef?.afterClosed()?.subscribe(result => {
      debugger;
      console.log(`Dialog result: ${result}`);
    });
  }

  storeInitialSize() {
    const self = this;
    this.dialogStepperRef.afterOpened()?.subscribe(result => {
      debugger;
      const elementId = self.dialogStepperRef.id;
      // const elr = self.elementRef.nativeElement.querySelector(`[id="${elementId}"]`);
      const element = document.getElementById(elementId);
      this.currentDialogSize.step0.width = element.offsetWidth;
      this.currentDialogSize.step0.height = element.offsetHeight;
      this.currentDialogSize.step1.width = 1.5 * this.currentDialogSize.step0.width;
      this.currentDialogSize.step2.width = 0.7 * this.currentDialogSize.step0.width;
    })
  }

  setIndex(event) {
    debugger;
    this.selectedIndex = event.selectedIndex;
    if (event?.selectedIndex === 0) {
      this.dialogStepperRef.updateSize(`${this.currentDialogSize.step0.width}px`);
    } else if (event?.selectedIndex === 1) {
      this.dialogStepperRef.updateSize(`100vw`);
      // this.dialogStepperRef.updateSize(`${this.currentDialogSize.step1.width}px`);
    } else if (event?.selectedIndex === 2) {
      this.dialogStepperRef.updateSize(`${this.currentDialogSize.step2.width}px`);
    }
  }

  triggerClick(event) {
    // debugger;
    console.log(`Selected tab index: ${this.selectedIndex}`);
  }

  goBack(stepper: MatStepper) {
    // debugger;
    stepper.previous();
  }

  goForward(stepper: MatStepper) {
    // debugger;
    stepper.next();
  }


  move(index: number) {
    // debugger;
    this.stepper.selectedIndex = index;
  }

  addItems(newItems: any) {
    // debugger;
    this.addItemsAndStepNext(newItems);
  }

  addItemsAndStepNext(items: any) {
    // debugger;
    this.recordsNew = items;
    this.stepper.next();
  }

  submitRecord() {
    debugger;
    this.emitEventToChild();
  }

  emitEventToChild() {
    this.triggerSubmit.next('');
  }

  close() {
    console.log('closed');
    this.dialogStepperRef.close('closeBtn');
  }

  submitRecordsEventParent(submittedItems) {
    debugger;
    this.submitItemsAndStepNext(submittedItems);
  }

  submitItemsAndStepNext(submittedItems: any) {
    // debugger;
    if (submittedItems && submittedItems?.length > 0) {
      this.submittedRecords = submittedItems;
      this.stepper.next();
    }
  }


}
