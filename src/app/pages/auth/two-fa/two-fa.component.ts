import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiForm } from 'src/app/core/abstract/api-from';
import { AuthService } from 'src/app/core/services/auth.service';
import { CoreService } from 'src/app/core/services/core.service';
import { ScrollService } from 'src/app/core/services/scroll.service';
import { PageModel } from 'src/app/data/models/page.models';

@Component({
    selector: 'app-two-fa',
    templateUrl: './two-fa.component.html',
    styleUrls: ['../auth.component.scss'],
})
export class TwoFaComponent extends ApiForm implements OnInit {
    formGroup: FormGroup;
    pageErrors: PageModel;
    page: PageModel;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router,
        private scrollService: ScrollService,
        public coreService: CoreService
    ) {
        super(
            fb.group({
                code: fb.control('', {
                    validators: [Validators.required],
                }),
            })
        );
    }

    ngOnInit(): void {
        this.route.data.subscribe((data) => {
            this.page = data.page;
            this.pageErrors = data.page.errors;
        });
    }

    prepareRequest(): Observable<any> {
        const data = this.formGroup.getRawValue();
        data.code = data.code.replaceAll('-', '');

        return this.authService.login({
            ...this.authService.authData,
            ...data,
        });
    }

    onRequestFailed(errorResponse: HttpErrorResponse): void {
        this.onError();
    }

    onRequestSuccess(value: any): void {
        if (value?.error) {
            this.onError();
        } else {
            this.onSuccess();
        }
    }

    onError() {
        this.control('code').setErrors({ wrongCode: true });
        this.syncErrors();
    }

    onSuccess() {
        this.scrollService.enableScroll = false;
        this.router.navigateByUrl('/acc/form');
    }

    inputSubmit(length) {
        if (length === 11) {
            this.submit();
        }
    }
}
