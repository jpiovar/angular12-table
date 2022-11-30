import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-insert-new-btn',
  templateUrl: './insert-new-btn.component.html',
  styleUrls: ['./insert-new-btn.component.scss']
})
export class InsertNewBtnComponent implements OnInit, OnChanges {
  @Input() btnDisabled: boolean = false;

  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
  }

  openInsertDialog() {

  }

}
