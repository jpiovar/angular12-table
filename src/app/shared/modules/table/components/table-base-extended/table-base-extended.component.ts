import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-table-base-extended',
  templateUrl: './table-base-extended.component.html',
  styleUrls: ['./table-base-extended.component.scss']
})
export class TableBaseExtendedComponent implements OnInit, OnChanges {
  @Input() itemRecordNew: any = {};

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(): void { }

}
