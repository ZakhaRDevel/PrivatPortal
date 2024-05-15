import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'replace',
})
export class ReplacePipe implements PipeTransform {
    constructor() {}

    transform(value: string, variables: any) {
        let transformedString: any = value;

        Object.keys(variables).forEach((key) => {
            try {
                transformedString = transformedString.replaceAll(`{{${key}}}`, variables[key]);
            } catch (e) {
                transformedString = '';
            }
        });

        return transformedString;
    }
}
