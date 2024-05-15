import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GiveawaysPageComponent} from './giveaways-page/giveaways-page.component';
import {GiveawaysHistoryPageComponent} from './giveaways-history-page/giveaways-history-page.component';
import {GiveawaysRoutingModule} from "./giveaways-routing.module";
import {ModalWithdrawComponent} from "./giveaways-page/modal-withdraw/modal-withdraw.component";
import {ModalTicketsComponent} from "./giveaways-page/modal-tickets/modal-tickets.component";
import {GiveawaysComponent} from "./giveaways.component";
import {ModalTelegramComponent} from "./giveaways-page/modal-telegram/modal-telegram.component";
import {AccordionItemComponent} from "./accordion-item/accordion-item.component";
import {ThemeModule} from "../../../../theme/theme.module";
import {CoreModule} from "../../../../core/core.module";
import {OverlayscrollbarsModule} from "overlayscrollbars-ngx";
import {MatInputModule} from "@angular/material/input";
import {DirectivesModule} from "../../../../core/derective/directives.module";
import {MatNativeDateModule, MatRippleModule} from "@angular/material/core";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxPaginationModule} from "ngx-pagination";
import {NgSelectModule} from "@ng-select/ng-select";
import {MatIconModule} from "@angular/material/icon";
import { ModalAccordionItemComponent } from './modal-accordion-item/modal-accordion-item.component';


@NgModule({
    declarations: [
        GiveawaysComponent,
        GiveawaysPageComponent,
        GiveawaysHistoryPageComponent,
        ModalWithdrawComponent,
        ModalTicketsComponent,
        AccordionItemComponent,
        ModalTelegramComponent,
        ModalAccordionItemComponent
    ],
    imports: [
        CommonModule,
        GiveawaysRoutingModule,
        NgSelectModule,
        FormsModule,
        ReactiveFormsModule,
        DirectivesModule,
        ThemeModule,
        OverlayscrollbarsModule,
        NgxPaginationModule,
        MatDatepickerModule,
        MatInputModule,
        MatIconModule,
        MatNativeDateModule,
        MatRippleModule,
        CoreModule,
    ]
})
export class GiveawaysModule {
}
