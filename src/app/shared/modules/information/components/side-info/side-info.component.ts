import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { BreakOnPipe } from 'src/app/shared/pipes/break.pipe';
import { nl2brPipe } from 'src/app/shared/pipes/nl2br.pipe';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-side-info',
  templateUrl: './side-info.component.html',
  styleUrls: ['./side-info.component.scss']
})
export class SideInfoComponent implements OnInit {

  @ViewChild('popover1') public popover: NgbPopover;

  infoBoxTitle = environment.infoBoxTitle;
  infoBoxText = environment.infoBoxText;

  constructor(
    private breakPipe: BreakOnPipe,
    private nl2br: nl2brPipe
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      if (!this.popover.isOpen()) {
        this.popover.open();
      }
    }, 1000);
  }

  getBreak(item: string): string {
    return this.breakPipe.transform(item);
  }
  get2Br(item: string): string {
    return this.nl2br.transform(item);
  }

}
