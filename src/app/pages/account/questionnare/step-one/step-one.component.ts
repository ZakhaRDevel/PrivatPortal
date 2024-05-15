import {
    Component,
    ElementRef,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { UserService } from 'src/app/data/services/user.service';
import { UserModel } from 'src/app/data/models/user.model';
import { CountryService } from 'src/app/data/services/country.service';
import { CountryModel } from 'src/app/data/models/country.model';
import { PageModel } from 'src/app/data/models/page.models';
import { ApiForm } from 'src/app/core/abstract/api-from';
import { nameValidator } from 'src/app/core/validators/name.validator';
import { telegramValidator } from 'src/app/core/validators/telegram.validator';
import { nameLengthValidator } from 'src/app/core/validators/name-length.validator';
import { telegramLengthValidator } from 'src/app/core/validators/telegram-length.validator';
import { ScrollService } from 'src/app/core/services/scroll.service';

@Component({
    selector: 'app-step-one',
    templateUrl: './step-one.component.html',
    styleUrls: ['../questionnare.component.scss'],
})
export class StepOneComponent extends ApiForm implements OnInit {
    formGroup: FormGroup;
    countries: CountryModel[] = [];
    icon = '*';
    page: PageModel;
    pageErrors: PageModel;
    me: UserModel;
    @Output() nextStep = new EventEmitter();

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private countryService: CountryService,
        private scrollService: ScrollService
    ) {
        super(
            fb.group({
                telegram: fb.control('', Validators.required),
                // phone: fb.control(null, Validators.required),
                userDetail: fb.group({
                    fullName: fb.control('', Validators.required),
                    country: fb.control(null, Validators.required),
                }),
            })
        );

        this.control('fullName', 'userDetail').addValidators(nameValidator());
        this.control('fullName', 'userDetail').addValidators(
            nameLengthValidator()
        );
        this.control('fullName', 'userDetail').updateValueAndValidity();
        this.control('telegram').addValidators(telegramLengthValidator());
        this.control('telegram').addValidators(telegramValidator());
        this.control('telegram').updateValueAndValidity();
    }

    ngOnInit(): void {
        this.initData();
    }

    ngOnDestroy(): void {
        this.clearErrorObservers();
    }

    initData() {
        this.route.data.subscribe((data) => {
            this.me = data.me;
            this.setFormValues(this.formGroup, this.me);
            if (!this.me.userDetail?.country?.id) {
                this.control('country', 'userDetail').setValue(null);
            }
        });
        this.route.parent.data.subscribe((data) => {
            this.pageErrors = data.page.errors;
            this.page = data.page;
        });

        this.countryService.list().subscribe({
            next: (response) => {
                this.countries = response;
            },
        });
    }

    prepareRequest(): Observable<any> {
        const data = this.formGroup.getRawValue();
        data.userDetail.country = { id: data.userDetail.country.id };

        return this.userService.update(data);
    }

    onRequestSuccess(value: UserModel) {
        this.router.navigateByUrl('/acc/form/step-two');
        this.scrollService.enableScroll = true;
    }
}
