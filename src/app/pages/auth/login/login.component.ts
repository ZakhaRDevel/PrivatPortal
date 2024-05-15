import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { LangService } from 'src/app/core/services/lang.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { UserModel } from 'src/app/data/models/user.model';
import { ModalWalletConnectComponent } from '../modal-wallet-connect/modal-wallet-connect.component';
import CryptoJS from 'crypto-js';
import { IHttpResponse } from 'src/app/core/interfaces/http-response.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiForm } from 'src/app/core/abstract/api-from';
import { PageModel } from 'src/app/data/models/page.models';
import { HttpErrorResponse } from '@angular/common/http';
import { CoreService } from '../../../core/services/core.service';
import { ScrollService } from 'src/app/core/services/scroll.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['../auth.component.scss'],
})
export class LoginComponent extends ApiForm implements OnInit {
    iconShowPassword = false;
    rememberMe = false;
    page: PageModel;
    pageErrors: PageModel;

    loaded: boolean;

    constructor(
        private fb: FormBuilder,
        private matDialog: MatDialog,
        private authService: AuthService,
        private langService: LangService,
        private ls: LocalStorageService,
        private router: Router,
        private route: ActivatedRoute,
        private scrollService: ScrollService,
        public coreService: CoreService
    ) {
        super(
            fb.group({
                login: fb.control('', {
                    validators: [Validators.required],
                }),
                password: fb.control('', {
                    validators: [Validators.required],
                }),
                locale: fb.control('en', {
                    validators: [Validators.required],
                }),
                rememberMe: fb.control(false, {
                    validators: [Validators.required],
                }),
            })
        );

        const login = this.ls.getItem('login') || '';
        let pwd = '';

        if (login) {
            const bytes = CryptoJS.AES.decrypt(this.ls.getItem('pwd'), login);
            pwd = bytes.toString(CryptoJS.enc.Utf8);

            this.control('login').setValue(login);
            this.control('password').setValue(pwd);
            this.control('rememberMe').setValue(true);
        }

        this.control('login').valueChanges.subscribe(() => {
            this.clearError(this.control('password'));
        });

        setTimeout(() => {
            this.loaded = true;
        }, 1000);
    }

    ngOnInit(): void {
        this.route.data.subscribe((data) => {
            this.page = data.page;
            this.pageErrors = data.page.errors;
        });
    }

    prepareRequest(): Observable<UserModel | IHttpResponse> {
        const data = this.formGroup.getRawValue();

        this.authService.authData.login = data.login.includes('@')
            ? data.login.toLowerCase()
            : data.login.toLowerCase().replace('pc', '');
        this.authService.authData.locale = this.langService.lang;
        this.authService.authData.password = data.password;

        return this.authService.login(this.authService.authData);
    }

    onRequestSuccess(value: UserModel) {
        this.ls.removeItem('login');
        this.ls.removeItem('pwd');

        if (this.control('rememberMe').value) {
            this.ls.setItem('login', this.control('login').value);
            this.ls.setItem(
                'pwd',
                CryptoJS.AES.encrypt(
                    this.control('password').value,
                    this.control('login').value
                ).toString()
            );
        }

        if (value?.google2fa === true) {
            this.router.navigate(['/2fa']);
        } else {
            this.onSuccess();
        }
    }

    onRequestFailed(errorResponse: HttpErrorResponse): void {
        super.onRequestFailed(errorResponse);
        if (errorResponse?.error?.message) {
            if (errorResponse?.error?.message[0]) {
                if (errorResponse?.error?.message[0].property === 'login') {
                    this.errorsCodes['password'] = [];
                    this.errorsCodes['login'] = [];
                    this.errorsCodes['password'].push('wrongEmail');
                }
            }
        }
    }

    onToggleIconPassword() {
        this.iconShowPassword = !this.iconShowPassword;
    }

    onSuccess() {
        this.scrollService.enableScroll = false;
        this.router.navigateByUrl('/acc/form');
    }

    onOpenModalWalletConnect() {
        const dialog = this.matDialog.open(ModalWalletConnectComponent, {
            backdropClass: 'form-dialog-backdrop',
            panelClass: 'form-dialog-container',
            data: { page: this.page },
        });

        dialog.afterClosed().subscribe((data) => {
            if (data) {
                this.onSuccess();
            }
        });
    }
}
