import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-hamburger-button',
  templateUrl: './hamburger-button.component.html',
  styleUrls: ['./hamburger-button.component.scss']
})
export class HamburgerButtonComponent implements OnInit, OnChanges {
  @Input() openedSidenav: boolean = false;
  closeBtn: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(): void {}

}
