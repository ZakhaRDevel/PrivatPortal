import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter',
})
export class FilterPipe implements PipeTransform {
    transform(
        items: any[],
        param: any,
        action: string,
        args?: any,
        id?: number
    ): any {
        switch (action) {
            case 'without':
                return items.filter((item: any) => !args.includes(item[param]));
            case 'with':
                return items.filter((item: any) => args.includes(item[param]));
            case 'has':
                return items.filter((item: any) => item[param] === true);
            case 'not_has':
                return items.filter((item: any) => !item[param]);
            case 'with_id':
                return items.filter((item: any) => item[param] === id);
            case 'like':
                return items.filter(
                    (item: any) =>
                        item[param[0]]
                            .toLowerCase()
                            .includes(args.toLowerCase()) ||
                        item[param[1].split('.')[0]][param[1].split('.')[1]]
                            .toLowerCase()
                            .includes(args.toLowerCase())
                );
            case 'likeSingle':
                return items.filter(
                    (item: any) =>
                        item[param[0]]
                            .toLowerCase()
                            .includes(args.toLowerCase()) ||
                        (item[param[1]] &&
                            item[param[1]]
                                .toLowerCase()
                                .includes(args.toLowerCase())) ||
                        (item[param[2]] &&
                            item[param[2]]
                                .toLowerCase()
                                .includes(args.toLowerCase()))
                );
            case 'phone':
                return items.filter(
                    (item: any) =>
                        item[param[0]]
                            ?.replace('+', '')
                            ?.slice(0, args.length) == args ||
                        item[param[0]]?.slice(0, args.length) == args ||
                        (item[param[1]] &&
                            item[param[1]]
                                .toLowerCase()
                                .includes(args.toLowerCase())) ||
                        (item[param[2]] &&
                            item[param[2]]
                                .toLowerCase()
                                .includes(args.toLowerCase()))
                );
            default:
                return items;
        }
    }
}
