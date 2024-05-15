import { Component, Input } from '@angular/core';
import { PageModel } from 'src/app/data/models/page.models';

@Component({
    selector: 'pc-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss'],
})
export class InputComponent {
    @Input() isInvalid: boolean;
    @Input() errors: string[] = [];
    @Input() errorsTranslate: PageModel;
    @Input() withErrors: boolean = true;
    @Input() requiredKey: string = 'required';
    @Input() replace: any = {};

    _error(error: string) {
        return this.errorsTranslate.data[
            error === 'required' ? this.requiredKey : error
        ];
    }
}
