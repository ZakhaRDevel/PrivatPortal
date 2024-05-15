import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ModalSecurityComponent } from '../modal-security/modal-security.component';
import { UserService } from 'src/app/data/services/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { PageModel } from 'src/app/data/models/page.models';
import { UserModel } from 'src/app/data/models/user.model';
import { ApiForm } from 'src/app/core/abstract/api-from';
import { ScrollService } from 'src/app/core/services/scroll.service';

@Component({
    selector: 'app-step-four',
    templateUrl: './step-four.component.html',
    styleUrls: ['../questionnare.component.scss'],
})
export class StepFourComponent extends ApiForm implements OnInit {
    placeholder = window.innerWidth > 1024 ? 'https//' : '@';

    formGroup: FormGroup;
    page: PageModel;
    pageErrors: PageModel;
    me: UserModel;

    constructor(
        private router: Router,
        private matDialog: MatDialog,
        private userService: UserService,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private scrollService: ScrollService
    ) {
        super(
            fb.group({
                twitterUrl: fb.control(''),
                facebookUrl: fb.control(''),
                linkedinUrl: fb.control(''),
                instagramUrl: fb.control(''),
                tiktokUrl: fb.control(''),
                customUrl: fb.control(''),
            })
        );
    }

    ngOnInit(): void {
        this.initData();
        this.scrollService.enableScroll = true;
    }

    initData() {
        this.route.data.subscribe((data) => {
            this.me = data.me;
            this.setFormValues(this.formGroup, this.me.userDetail);
        });
        this.route.parent.data.subscribe((data) => {
            this.page = data.page;
            this.pageErrors = data.page.errors;
        });
    }

    prepareRequest(): Observable<any> {
        const data = this.formGroup.getRawValue();

        if (
            data.twitterUrl &&
            !data.twitterUrl.includes('https://twitter.com/')
        ) {
            data.twitterUrl = `https://twitter.com/${data.twitterUrl}`;
        }

        if (
            data.facebookUrl &&
            !data.facebookUrl.includes('https://facebook.com/')
        ) {
            data.facebookUrl = `https://facebook.com/${data.facebookUrl}`;
        }

        if (
            data.linkedinUrl &&
            !data.linkedinUrl.includes('https://linkedin.com/')
        ) {
            data.linkedinUrl = `https://linkedin.com/${data.linkedinUrl}`;
        }

        if (
            data.instagramUrl &&
            !data.instagramUrl.includes('https://instagram.com/')
        ) {
            data.instagramUrl = `https://instagram.com/${data.instagramUrl}`;
        }

        if (data.tiktokUrl && !data.tiktokUrl.includes('https://tiktok.com/')) {
            data.tiktokUrl = `https://tiktok.com/${data.tiktokUrl}`;
        }
        if (
            data.customUrl &&
            !data.customUrl.includes('https://www.youtube.com/')
        ) {
            data.customUrl = `https://www.youtube.com/${data.customUrl}`;
        }

        // if (data.customUrl && !data.customUrl.includes('https://')) {
        //     data.customUrl = `https://${data.customUrl}`;
        // }

        return this.userService.update({
            userDetail: data,
            userQuestionnaire: { isCompleted: true },
        });
    }

    onRequestSuccess(value: any): void {
        this.openSecurityDialog();
    }

    clickPrevStep() {
        // this.router.navigateByUrl('/acc/form/step-three');
        this.router.navigateByUrl('/acc/form/step-three');
    }

    openSecurityDialog() {
        this.matDialog
            .open(ModalSecurityComponent, {
                disableClose: true,
                autoFocus: false,
                panelClass: 'security-dialog-container',
                data: {
                    page: this.page,
                },
            })
            .afterClosed()
            .subscribe(() => {
                window.scrollTo(0, 0);
            });
    }
}
