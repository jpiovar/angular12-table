import { Component, Inject, OnInit, ViewChild } from '@angular/core';
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

  @ViewChild('stepper') stepper: MatStepper;

  constructor(
    public dialogStepperRef: MatDialogRef<DialogStepperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.initializeContent();
  }

  initializeContent() {
    // debugger;
    this.content = this.data;

    console.log(this.content);

    // this.modifiedContent = JSON.parse(JSON.stringify(this.content));

    // this.dialogStepperRef?.afterClosed()?.subscribe(result => {
    //   // debugger;
    //   console.log(`Dialog result: ${result}`);
    // });
  }

  setIndex(event) {
    debugger;
    this.selectedIndex = event.selectedIndex;
  }

  triggerClick(event) {
    debugger;
    console.log(`Selected tab index: ${this.selectedIndex}`);
  }

  goBack(stepper: MatStepper) {
    debugger;
    stepper.previous();
  }

  goForward(stepper: MatStepper) {
    debugger;
    stepper.next();
  }


  move(index: number) {
    debugger;
    this.stepper.selectedIndex = index;
  }

  addItems(newItems: any) {
    debugger;
    this.addItemsAndStepNext(newItems)
  }

  addItemsAndStepNext(items: any) {
    debugger;
    this.recordsNew = items;
    this.stepper.next();
  }

}
