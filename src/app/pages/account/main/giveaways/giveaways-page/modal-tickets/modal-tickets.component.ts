import {
    AfterViewInit,
    Component,
    ElementRef,
    Inject,
    OnInit,
    ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiForm } from '../../../../../../core/abstract/api-from';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { GiveawayService } from 'src/app/data/services/giveaway.service';
import { maxAmountValidator } from 'src/app/core/validators/max-amount.validator';
import { PageModel } from 'src/app/data/models/page.models';
import { UserGiveawayModel } from 'src/app/data/models/user-giveaway.model';

@Component({
    selector: 'app-modal-tickets',
    templateUrl: './modal-tickets.component.html',
    styleUrls: ['./modal-tickets.component.scss'],
})
export class ModalTicketsComponent extends ApiForm implements OnInit {
    isSuccessful: boolean = false;
    userGiveaway: UserGiveawayModel;

    get ticketsValue() {
        return this.control('tickets')?.value;
    }

    get declOfNum() {
        let titles = [
            this.data.page.data.modalTickets.ticket1,
            this.data.page.data.modalTickets.ticket2,
            this.data.page.data.modalTickets.ticket3,
        ];
        let cases = [2, 0, 1, 1, 1, 2];
        return titles[
            this.ticketsValue % 100 > 4 && this.ticketsValue % 100 < 20
                ? 2
                : cases[this.ticketsValue % 10 < 5 ? this.ticketsValue % 10 : 5]
        ];
    }
    constructor(
        private matDialogRef: MatDialogRef<ModalTicketsComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            tickets: number;
            giveawayId: number;
            page: PageModel;
            pageErrors: PageModel;
        },
        private fb: FormBuilder,
        private giveawayService: GiveawayService
    ) {
        super(
            fb.group({
                tickets: fb.control(null, Validators.required),
                giveawayId: fb.control(null, Validators.required),
            })
        );

        this.reset = false;

        this.control('giveawayId').setValue(this.data.giveawayId);
        this.control('tickets').addValidators(
            maxAmountValidator(+this.data.tickets)
        );
    }

    ngOnInit(): void {
        const modalTypeTwoBackdrop = window.document.querySelector<any>(
            '.modalTypeTwoBackdrop'
        );

        if (modalTypeTwoBackdrop?.parentNode) {
            modalTypeTwoBackdrop.parentNode.classList.add('modal-type-two');
        }

        this.matDialogRef.afterClosed().subscribe(() => {
            const cdk = window.document.querySelector<any>(
                '.cdk-overlay-container'
            );

            if (cdk) {
                cdk.classList.remove('modal-type-two');
            }
        });
    }

    prepareRequest(): Observable<any> {
        const data = this.formGroup.getRawValue();
        data.giveawayId = +data.giveawayId;
        data.tickets = +data.tickets;

        return this.giveawayService.create(data);
    }

    onRequestSuccess(res): void {
        this.isSuccessful = true;
        this.userGiveaway = UserGiveawayModel.fromJson(res);
        // setTimeout(() => this.matDialogRef.close({tickets: this.control().value}), 300);
    }

    modalClose() {
        setTimeout(() => {
            if (this.isSuccessful) {
                this.matDialogRef.close({
                    userGiveaway: this.userGiveaway,
                    tickets: this.ticketsValue,
                });
            } else {
                this.matDialogRef.close();
            }
        }, 300);
    }

    setMaxPoints() {
        this.control('tickets').setValue(this.data.tickets);
    }

    onTicketsChange(val) {
        val = val?.toString() || '';

        if (val.includes('.')) {
            val = val.split('.')[0];
            if (+val) {
                this.control('tickets').setValue(val);
            } else {
                this.control('tickets').setValue('0');
            }
        }

        if (!+val && +val !== 0) {
            this.control('tickets').setValue('0');
        }
    }
}
