import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomScrollDirective } from './custom-scroll.directive';
import { PhoneDirective } from './phone.directive';
import { LoadImgDirective } from './load-img.directive';
import { onlyNumber } from './onlynumber.directive';
import { MaskDirective } from './mask.directive';

@NgModule({
    declarations: [
        CustomScrollDirective,
        PhoneDirective,
        LoadImgDirective,
        onlyNumber,
        MaskDirective,
    ],
    imports: [CommonModule],
    exports: [
        CustomScrollDirective,
        PhoneDirective,
        LoadImgDirective,
        onlyNumber,
        MaskDirective,
    ],
})
export class DirectivesModule {}
