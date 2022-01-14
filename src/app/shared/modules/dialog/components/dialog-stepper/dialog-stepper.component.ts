import { Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { element } from 'protractor';

@Component({
  selector: 'app-dialog-stepper',
  templateUrl: './dialog-stepper.component.html',
  styleUrls: ['./dialog-stepper.component.scss']
})
export class DialogStepperComponent implements OnInit {
  content: any = {};
  selectedIndex: number = 0;
  recordsNew: any = null;
  currentDialogSize: any = { step0: {}, step1: {} };

  @ViewChild('stepper') stepper: MatStepper;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    public dialogStepperRef: MatDialogRef<DialogStepperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

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
    })
  }

  setIndex(event) {
    debugger;
    this.selectedIndex = event.selectedIndex;
    if (event?.selectedIndex === 0) {
      this.dialogStepperRef.updateSize(`${this.currentDialogSize.step0.width}px`);
    } else if (event?.selectedIndex === 1) {
      this.dialogStepperRef.updateSize(`${this.currentDialogSize.step1.width}px`);
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

}
