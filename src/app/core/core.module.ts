import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePipe } from './pipes/safe.pipe';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NumberFormatPipe } from './pipes/number-format.pipe';
import { FilterPipe } from './pipes/filter.pipe';
import { SortPipe } from './pipes/sort.pipe';
import { ReplacePipe } from './pipes/replace.pipe';
import { FindValuePipe } from './pipes/find-value.pipe';

@NgModule({
    declarations: [
        SafePipe,
        NumberFormatPipe,
        FilterPipe,
        SortPipe,
        ReplacePipe,
        FindValuePipe,
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
    ],
    exports: [
        SafePipe,
        NumberFormatPipe,
        FilterPipe,
        SortPipe,
        ReplacePipe,
        FindValuePipe,
    ],
    providers: [NumberFormatPipe],
})
export class CoreModule {
    static forRoot(): ModuleWithProviders<any> {
        return {
            ngModule: CoreModule,
            providers: [],
        } as ModuleWithProviders<any>;
    }
}
