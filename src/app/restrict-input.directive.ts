import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appRestrictInput]',
  standalone: true
})
export class RestrictInputDirective {
  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const input = this.el.nativeElement as HTMLInputElement;
    let value = input.value;

    // Allow numbers and up to two decimal places
    let sanitizedValue = value.replace(/[^0-9.]/g, '');

    // Handle multiple decimal points
    const parts = sanitizedValue.split('.');
    if (parts.length > 2) {
      sanitizedValue = parts[0] + '.' + parts.slice(1).join('');
    }

    // Restrict to two decimal places
    if (parts[1] && parts[1].length > 2) {
      sanitizedValue = parts[0] + '.' + parts[1].substring(0, 2);
    }

    if (sanitizedValue !== value) {
      input.value = sanitizedValue;
      event.stopPropagation();
    }
  }

  @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const pastedText = clipboardData.getData('text');
    const input = this.el.nativeElement as HTMLInputElement;
    let value = input.value;

    let sanitizedValue = (value + pastedText).replace(/[^0-9.]/g, '');

    // Handle multiple decimal points
    const parts = sanitizedValue.split('.');
    if (parts.length > 2) {
      sanitizedValue = parts[0] + '.' + parts.slice(1).join('');
    }

    // Restrict to two decimal places
    if (parts[1] && parts[1].length > 2) {
      sanitizedValue = parts[0] + '.' + parts[1].substring(0, 2);
    }

    input.value = sanitizedValue;
    event.preventDefault();
  }
}
