import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionnareComponent } from './questionnare.component';
import { StepThreeComponent } from './step-three/step-three.component';
import { StepFourComponent } from './step-four/step-four.component';
import { StepOneComponent } from './step-one/step-one.component';
import { StepTwoComponent } from './step-two/step-two.component';
import { QuestionnareRoutingModule } from './questionnare-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalSecurityComponent } from './modal-security/modal-security.component';
import { DirectivesModule } from 'src/app/core/derective/directives.module';
import { ThemeModule } from 'src/app/theme/theme.module';
import { CoreModule } from 'src/app/core/core.module';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { MatSliderModule } from '@angular/material/slider';

@NgModule({
    declarations: [
        QuestionnareComponent,
        StepOneComponent,
        StepTwoComponent,
        StepThreeComponent,
        StepFourComponent,
        ModalSecurityComponent,
    ],
    imports: [
        CommonModule,
        QuestionnareRoutingModule,
        NgSelectModule,
        FormsModule,
        ReactiveFormsModule,
        DirectivesModule,
        ThemeModule,
        OverlayscrollbarsModule,
        CoreModule,
        ScrollToModule.forRoot(),
        MatSliderModule,
    ],
})
export class QuestionnareModule {}
