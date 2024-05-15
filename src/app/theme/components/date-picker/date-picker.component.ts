import { OverlayContainer } from '@angular/cdk/overlay';
import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    Renderer2,
    ViewChild,
} from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { HiddenMenuService } from 'src/app/core/services/hidden-menu.service';
import { SwipeService } from 'src/app/core/services/swipe.service';
import { PageModel } from 'src/app/data/models/page.models';
import { ModalWindowService } from '../../modals/modal-window/modal-window.service';
import { DatePickerHeaderComponent } from './date-picker-header/date-picker-header.component';
import { UserModel } from 'src/app/data/models/user.model';
import moment from 'moment';

export const MY_FORMATS = {
    parse: {
        dateInput: 'LL',
    },
    display: {
        dateInput: 'YYYY-MM-DD',
        monthYearLabel: 'MMMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Component({
    selector: 'app-date-picker',
    templateUrl: './date-picker.component.html',
    styleUrls: ['./date-picker.component.scss'],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class DatePickerComponent implements OnInit {
    @Input() me: UserModel;
    @Output() onAdd = new EventEmitter();
    exampleHeader = DatePickerHeaderComponent;
    isOpenedDateTo: boolean = false;
    isOpenedDateFrom: boolean = false;
    maxDate: any;
    minDate: any;
    date_to: any;
    date_from: any;
    datePickerUsed: boolean;
    loading: boolean;
    filters = {
        orderBy: 'desc',
        orderByValue: 'id',
        date: null,
        payway_id: null,
        type: null,
        period: {
            from: null,
            to: null,
        },
        search: {
            partner_id: '',
        },
        page: {
            from: 0,
            to: 9,
        },
    };

    shown = false;
    currentModalData = { id: null, index: null };
    selectedPartnerIndex: number;

    @Input() page: PageModel;
    @ViewChild('dateFrom') private dateFrom: MatDatepicker<Date>;
    @ViewChild('dateTo') private dateTo: MatDatepicker<Date>;

    constructor(
        private renderer: Renderer2,
        private overlayContainer: OverlayContainer,
        private modalService: ModalWindowService,
        private swipeService: SwipeService,
        private hiddenMenuService: HiddenMenuService
    ) {}

    ngOnInit(): void {
        this.swipeService.isSwipeChange.subscribe(() => {
            if (
                this.swipeService.swipeSide === 'down' &&
                this.hiddenMenuService.name === 'date-picker'
            ) {
                this.closeDate();
            }
        });
        this.filter(true);
    }

    // toggleDateModal(isShow: boolean) {
    //     const overlayContainerElement: HTMLElement =
    //         this.overlayContainer.getContainerElement();

    //     if (isShow) {
    //         overlayContainerElement.classList.add('modal-datepicker');
    //         this.renderer.setProperty(
    //             overlayContainerElement,
    //             '@.disabled',
    //             true
    //         );
    //         this.hiddenMenuService.name = 'date-picker';
    //     } else {
    //         overlayContainerElement.classList.remove('modal-datepicker');
    //         this.renderer.setProperty(
    //             overlayContainerElement,
    //             '@.disabled',
    //             false
    //         );

    //         this.hiddenMenuService.name = '';
    //     }
    // }

    toggleDateModal(isShow: boolean, picker: string) {
        if (picker === 'dateTo') {
            this.isOpenedDateTo = isShow;
        }
        if (picker === 'dateFrom') {
            this.isOpenedDateFrom = isShow;
        }
        const overlayContainerElement: HTMLElement =
            this.overlayContainer.getContainerElement();
        let innerWight = window.innerWidth;

        if (isShow) {
            overlayContainerElement.classList.add('modal-datepicker');
            this.hiddenMenuService.name = 'date-picker';
        } else {
            if (innerWight > 1024) {
                setTimeout(() => {
                    overlayContainerElement.classList.remove(
                        'modal-datepicker'
                    );
                }, 100);
            } else {
                overlayContainerElement.classList.remove('modal-datepicker');
            }

            this.hiddenMenuService.name = '';
        }
    }

    closeModal(modalId: string, refresh?: boolean) {
        this.modalService.close(modalId);
        this.currentModalData.id = null;
        this.currentModalData.index = null;
        // if (refresh) {
        //     this.loadByFilters();
        // }
    }

    onPeriodChange() {
        this.onAdd.emit([this.date_from, this.date_to]);
    }

    closeDate() {
        const overlayContainerElement: HTMLElement =
            this.overlayContainer.getContainerElement();

        overlayContainerElement.classList.add('closing');

        setTimeout(() => {
            this.dateFrom.close();
            this.dateTo.close();
            this.hiddenMenuService.name = '';
            overlayContainerElement.classList.remove('closing');
        }, 300);
    }

    dateChange() {
        if (this.date_to && this.date_from) {
            if (moment(this.date_from).isAfter(this.date_to)) {
                let temp = this.date_from;
                this.date_from = this.date_to;
                this.date_to = temp;
            }
        }
    }

    filter(init: boolean = false) {
        if (init) {
            this.maxDate = moment();
            this.minDate = moment(this.me.createdDate);
            this.date_from = moment(this.me.createdDate);

            if (
                moment(this.me.createdDate)
                    .add('months', 6)
                    .isAfter(this.maxDate)
            ) {
                this.date_to = this.maxDate;
            } else {
                this.date_to = moment(this.me.createdDate).add('months', 6);
            }
        }
    }

    clearDate(event, date) {
        event.stopPropagation();
        if (date === 'date_to') {
            this.date_to = null;
        } else {
            this.date_from = null;
        }
    }
}
