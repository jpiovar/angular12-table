import { Directive } from "@angular/core";
import { NgbInputDatepicker } from "@ng-bootstrap/ng-bootstrap";

@Directive({
  selector: '[appNgbDatepickerI18nTitle]',
  exportAs: 'appNgbDatepickerI18nTitle'
})
export class NgbDatepickerI18nTitleDirective {

  constructor(
    private datepicker: NgbInputDatepicker,
  ) {
    const previousToggle = this.datepicker.toggle;
    this.datepicker.toggle = () => {
      previousToggle.bind(this.datepicker)();
      if (this.datepicker.isOpen()) {
        this.swapTitles();
      }
    };
  }

  swapTitles(): void {
    // @ts-ignore
    const previousMonth = this.datepicker._cRef.location.nativeElement.querySelector('button[title="Previous month"]');
    previousMonth.setAttribute('title', 'Predošlý mesiac');
    previousMonth.setAttribute('aria-label', 'Predošlý mesiac');

    // @ts-ignore
    const previousMonth = this.datepicker._cRef.location.nativeElement.querySelector('button[title="Next month"]');
    previousMonth.setAttribute('title', 'Nasledujúci mesiac');
    previousMonth.setAttribute('aria-label', 'Nasledujúci mesiac');

    // @ts-ignore
    const selectMonth = this.datepicker._cRef.location.nativeElement.querySelector('select[title="Select month"]');
    selectMonth.setAttribute('title', 'Vyberte mesiac');
    selectMonth.setAttribute('aria-label', 'Vyberte mesiac');

    // @ts-ignore
    const selectYear = this.datepicker._cRef.location.nativeElement.querySelector('select[title="Select year"]');
    selectYear.setAttribute('title', 'Vyberte rok');
    selectYear.setAttribute('aria-label', 'Vyberte rok');
  }
}
