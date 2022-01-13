import { Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-dialog-stepper',
  templateUrl: './dialog-stepper.component.html',
  styleUrls: ['./dialog-stepper.component.scss']
})
export class DialogStepperComponent implements OnInit {
  content: any = {};
  selectedIndex: number = 0;
  recordsNew: any = null;
  currentDialogSize: any = { width: '0px', height: '0px' };

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
      const elr = self.elementRef.nativeElement.querySelector(`#${elementId}`);
      const el = self.renderer.selectRootElement(`#${elementId}`);
      window.getComputedStyle(el);
    })
  }

  setIndex(event) {
    debugger;
    this.selectedIndex = event.selectedIndex;
    if (event?.selectedIndex === 1) {
      this.dialogStepperRef.updateSize("100vw");
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
