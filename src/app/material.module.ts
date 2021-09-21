import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MatNativeDateModule, MatOptionModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule} from '@angular/material/chips';
import { DragDropModule} from '@angular/cdk/drag-drop';
import { MatCheckboxModule} from '@angular/material/checkbox';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatStepperModule } from '@angular/material/stepper';
import { MatListModule } from '@angular/material/list';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';



export class AppDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: any): string {
    if (displayFormat === 'input') {
      let day: string = date.getDate().toString();
      day = +day < 10 ? '0' + day : day;
      let month: string = (date.getMonth() + 1).toString();
      month = +month < 10 ? '0' + month : month;
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    }
    return date.toDateString();
  }
}


export const ADIS_DATE_FORMATS = {
  parse: {
    dateInput: ['LL', 'D.M.YYYY', 'DD.MM.YYYY', 'D.M.YY', 'DD.MM.YY'],
    // dateInput: { day: 'numeric', month: 'short', year: 'numeric' }
    // dateInput: 'input',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    // dateInput: 'input',
    // dateInput: { day: 'numeric', month: 'short', year: 'numeric' },
    monthYearLabel: 'MMM YYYY',
  },
};

const MATERIAL_MODULES = [
  MatButtonModule,
  MatDialogModule,
  MatOptionModule,
  MatIconModule,
  MatSelectModule,
  MatInputModule,
  MatFormFieldModule,
  MatProgressBarModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSnackBarModule,
  MatTooltipModule,
  MatTabsModule,
  MatIconModule,
  MatChipsModule,
  DragDropModule,
  MatCheckboxModule,
  MatMomentDateModule,
  MatStepperModule,
  MatListModule,
  MatAutocompleteModule,
  MatMenuModule,
  MatSidenavModule,
  MatExpansionModule
];
@NgModule({
  imports: [
    CommonModule,
    ...MATERIAL_MODULES
  ],
  exports: [
    ...MATERIAL_MODULES
  ],
  providers: [
      { provide: MAT_DATE_LOCALE, useValue: 'cs-CZ' },
      // {provide: DateAdapter, useClass: AppDateAdapter},
      { provide: MAT_DATE_FORMATS, useValue: ADIS_DATE_FORMATS},
  ]
})
export class MaterialModule { }
