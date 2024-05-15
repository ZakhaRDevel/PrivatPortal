import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CheckScreenSizeService } from 'src/app/core/services/check-screen-size.service';
import { PageModel } from 'src/app/data/models/page.models';
import { UserNftModel } from 'src/app/data/models/user-nft.model';
import { UserModel } from 'src/app/data/models/user.model';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-nft-item',
    templateUrl: './nft-item.component.html',
    styleUrls: ['./nft-item.component.scss'],
})
export class NftItemComponent implements OnInit {
    @Input() item: UserNftModel;
    @Input() user: UserModel;
    @Input() page: PageModel;
    @Input() pageErrors: PageModel;

    @ViewChild('details') details: ElementRef;
    @ViewChild('description') description: ElementRef;
    @ViewChild('description__header') description__header: ElementRef;

    isDetailsActive: boolean = true;
    isDetailsShown: boolean = true;

    isDescriptionActive: boolean = false;
    isDescriptionShown: boolean = false;

    descriptionMargin: string = '';
    detailsMargin: string = '';
    env = environment;

    @Output() onTransferEvent: EventEmitter<UserNftModel> =
        new EventEmitter<UserNftModel>();

    get contract(): string {
        return `${this.env.contract.slice(0, 5)}...${this.env.contract.slice(
            this.env.contract.length - 5,
            this.env.contract.length
        )}`;
    }

    get isMobile(): boolean {
        return innerWidth < 1024 ? true : false;
    }

    constructor(private matDialog: MatDialog) {}

    ngOnInit(): void {}

    toggleDetails(): void {
        this.isDetailsActive = !this.isDetailsActive;
        if (this.isDetailsActive) {
            setTimeout(() => {
                this.isDetailsShown = true;
                if (this.isMobile) {
                    this.scrollToElem(this.details.nativeElement, 70);
                }
            }, 400);
            this.detailsMargin = '0';
        } else {
            this.isDetailsShown = false;
            this.detailsMargin = `-${this.details.nativeElement.offsetHeight}px`;
        }
    }

    toggleDescription(): void {
        this.isDescriptionActive = !this.isDescriptionActive;

        if (this.isDescriptionActive) {
            setTimeout(() => {
                this.isDescriptionShown = true;
                if (this.isMobile) {
                    this.scrollToElem(
                        this.description__header.nativeElement,
                        70
                    );
                }
            }, 400);
            this.descriptionMargin = '0';
        } else {
            this.isDescriptionShown = false;
            this.descriptionMargin = `-${this.description.nativeElement.offsetHeight}px`;
        }
    }

    openTransfer(selectedUserNft: UserNftModel) {
        this.onTransferEvent.emit(selectedUserNft);
    }

    scrollToElem(elem, offsetCorrect = 0) {
        let bodyRect = document.body.getBoundingClientRect();
        let elemRect = elem.getBoundingClientRect();
        let offset = elemRect.top - bodyRect.top;
        scrollTo(0, offset - offsetCorrect);
        console.log(offset);
    }
}
