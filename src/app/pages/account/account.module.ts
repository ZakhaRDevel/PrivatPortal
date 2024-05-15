import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './account.component';
import { AccountRoutingModule } from './account-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { DirectivesModule } from 'src/app/core/derective/directives.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from 'src/app/theme/theme.module';

import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';

@NgModule({
    declarations: [AccountComponent],
    imports: [
        CommonModule,
        AccountRoutingModule,
        NgSelectModule,
        FormsModule,
        ReactiveFormsModule,
        DirectivesModule,
        ThemeModule,
        OverlayscrollbarsModule,
        ThemeModule,
    ],
})
export class AccountModule {}
