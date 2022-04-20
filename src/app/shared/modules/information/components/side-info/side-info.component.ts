import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-side-info',
  templateUrl: './side-info.component.html',
  styleUrls: ['./side-info.component.scss']
})
export class SideInfoComponent implements OnInit {

  @ViewChild('popover1') public popover: NgbPopover;

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      if (!this.popover.isOpen()) {
        this.popover.open();
      }
    });
  }

}
