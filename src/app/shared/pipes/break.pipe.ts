import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import DOMPurify from 'dompurify';

@Pipe({
  name: 'breakOn'
})
export class BreakOnPipe implements PipeTransform {
  public transform(value: string, ...args: any[]): any {
    return value.replace(/,|;/g, '<br>'); //replace all ',' and ';' with <br>
  }
}
