import { animate, style, transition, trigger } from '@angular/animations';
import {
    Component,
    ElementRef,
    Inject,
    OnInit,
    ViewChild,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClipboardService } from 'ngx-clipboard';
import { PageModel } from 'src/app/data/models/page.models';

@Component({
    selector: 'app-modal-banner',
    templateUrl: './modal-banner.component.html',
    styleUrls: ['./modal-banner.component.scss'],
    animations: [
        trigger('ModalAnimate', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('500ms', style({ opacity: 1 })),
            ]),
        ]),
    ],
})
export class ModalBannerComponent implements OnInit {
    sliderState = 'start';
    banners = [
        {
            id: 1,
            vertical: 'assets/img/pages/referals/banner_1-9:16.png',
            square: 'assets/img/pages/referals/banner_1-1:1.png',
            wide: 'assets/img/pages/referals/banner_1-16:9.png',
        },
        {
            id: 2,
            vertical: 'assets/img/pages/referals/banner_2-9:16.png',
            square: 'assets/img/pages/referals/banner_2-1:1.png',
            wide: 'assets/img/pages/referals/banner_2-16:9.png',
        },
        {
            id: 3,
            vertical: 'assets/img/pages/referals/banner_3-9:16.png',
            square: 'assets/img/pages/referals/banner_3-1:1.png',
            wide: 'assets/img/pages/referals/banner_3-16:9.png',
        },
    ];
    isClosing: boolean = false;
    bannerSize = 'square';
    activeBanner = 0;
    isCopiedActive;
    @ViewChild('slider') slider: ElementRef;

    bannerForSharing;

    get image() {
        return `${window.location.origin}/${
            this.banners[this.activeBanner][this.bannerSize]
        }`;
    }

    constructor(
        private matDialogRef: MatDialogRef<ModalBannerComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            page: PageModel;
            link: string;
        },
        private _clipboardService: ClipboardService
    ) {}

    ngOnInit(): void {}

    onCutLink() {}

    close() {
        this.isClosing = true;
        setTimeout(() => this.matDialogRef.close(), 300);
    }

    onBannerPrev() {
        if (this.activeBanner === 0) {
            this.activeBanner = this.banners.length - 1;
        } else {
            this.activeBanner--;
        }
    }

    onBannerNext() {
        if (this.activeBanner === this.banners.length - 1) {
            this.activeBanner = 0;
        } else {
            this.activeBanner++;
        }
    }

    selectBanner(index: number) {
        this.activeBanner = index;
    }

    copyString(text: string) {
        this._clipboardService.copy(text);
        this.isCopiedActive = true;
        setTimeout(() => (this.isCopiedActive = false), 2000);
    }

    async shareBanner() {
        //получил ссылку на изображение
        this.bannerForSharing =
            this.slider.nativeElement.querySelector('.banner').src;
        //

        //преборазовал ее в объект File
        const fileName = 'myFile.png';
        fetch(this.bannerForSharing).then(async (response) => {
            const blob = await response.blob();
            const file = new File([blob], fileName);
            //Использую API чтобы поделиться. Работает ,но пересылает только одно значение объекта :(
            try {
                await navigator.share({
                    files: [file],
                });
            } catch (err) {}
        });
    }
}
