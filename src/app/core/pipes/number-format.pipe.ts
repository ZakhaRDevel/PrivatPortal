import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'numberFormat' })
export class NumberFormatPipe implements PipeTransform {
    constructor() {}

    transform(value: number | string): string {
        return (+value).toLocaleString('en-US');
    }
}
