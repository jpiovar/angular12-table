import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-status-toggle-btn',
  templateUrl: './status-toggle-btn.component.html',
  styleUrls: ['./status-toggle-btn.component.scss']
})
export class StatusToggleBtnComponent implements OnInit, OnChanges {

  @Input() toggleBtnState: 'active'|'inactive' = 'active';

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    debugger;
    this.toggleBtnState;
  }

}
