import {
    Component,
    ElementRef,
    HostListener,
    Input,
    OnInit,
    Renderer2,
    ViewChild,
} from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { AuthService } from 'src/app/core/services/auth.service';
import { PageModel } from 'src/app/data/models/page.models';
import { UserModel } from 'src/app/data/models/user.model';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-ref-link',
    templateUrl: './ref-link.component.html',
    styleUrls: ['./ref-link.component.scss'],
})
export class RefLinkComponent implements OnInit {
    @Input() id: string;
    @Input() pageData: any;
    @Input() clickEvent: boolean;
    @ViewChild('dropdownStatus') dropdownStatus: ElementRef;
    @ViewChild('iconStatus') iconStatus: ElementRef;

    isCopiedActive: boolean = false;
    isOpenDropdown: boolean = false;

    get link(): string {
        return `${window.location.origin}/${
            this.me.nickname ? this.me.nickname : this.me.uplineId
        }`;
    }

    get me(): UserModel {
        return this.authService.currentUser;
    }

    constructor(
        private _clipboardService: ClipboardService,
        private authService: AuthService
    ) {}

    ngOnInit(): void {}

    copyHandler(): void {
        this.isCopiedActive = true;
        setTimeout(() => (this.isCopiedActive = false), 2000);
    }

    copyString(text: string) {
        this._clipboardService.copy(text);
        this.isCopiedActive = true;
        setTimeout(() => (this.isCopiedActive = false), 2000);
    }

    toggleDropdown() {
        if (this.clickEvent) {
            this.isOpenDropdown = true;
        } else {
            this.isOpenDropdown = false;
        }
    }

    // @HostListener('document:click', ['$event'])
    // clickout(event) {
    //     if (
    //         event.target !== this.iconStatus.nativeElement &&
    //         event.target !== this.dropdownStatus.nativeElement
    //     ) {
    //         this.isOpenDropdown = false;
    //     }
    // }
}
