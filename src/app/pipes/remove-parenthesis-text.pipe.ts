import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeParenthesisText',
})
export class RemoveParenthesisTextPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): string {
    if (!value) return value; // Return the original value if empty or undefined
    return value.split('(')[0].trim();
  }
}
