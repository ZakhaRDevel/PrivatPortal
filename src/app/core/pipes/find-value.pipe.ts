import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'findValue',
})
export class FindValuePipe implements PipeTransform {
    transform(
        items: any[],
        params: string[],
        value: any,
        findParam: string
    ): any {
        let item = null;

        if (params.length == 1) {
            item = items.find((itm) => itm[params[0]] === value);
        } else {
            item = items.find((itm) => itm[params[0]][params[1]] === value);
        }

        if (item) {
            return item[findParam];
        }

        return '';
    }
}
