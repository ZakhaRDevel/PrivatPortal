import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'sort',
})
export class SortPipe implements PipeTransform {
    transform(items: any[], param: string, type: string = 'ab'): any[] {
        return type === 'ab'
            ? items.sort((a, b) => a[param] - b[param])
            : items.sort((a, b) => b[param] - a[param]);
    }
}
