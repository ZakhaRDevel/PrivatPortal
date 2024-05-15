import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ApiForm } from 'src/app/core/abstract/api-from';
import { ScrollService } from 'src/app/core/services/scroll.service';
import { oneRequiredValidator } from 'src/app/core/validators/one-required.validator';
import { requiredBooleanValidator } from 'src/app/core/validators/required-boolean.validator';
import { PageModel } from 'src/app/data/models/page.models';
import { UserModel } from 'src/app/data/models/user.model';
import { UserService } from 'src/app/data/services/user.service';

@Component({
    selector: 'app-step-two',
    templateUrl: './step-two.component.html',
    styleUrls: ['../questionnare.component.scss'],
})
export class StepTwoComponent extends ApiForm implements OnInit {
    @Input() isInvalid: boolean;
    // @Input() errors: string[] = [];
    @Input() errorsTranslate: PageModel;
    icon = '*';
    formGroup: FormGroup;
    page: PageModel;
    pageErrors: PageModel;
    me: UserModel;

    scrollSubscription: Subscription;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private userService: UserService,
        private scrollService: ScrollService
    ) {
        super(
            fb.group({
                isInvestor: fb.control(false),
                isTrader: fb.control(false),
                isBlogger: fb.control(false),
                isFreelancer: fb.control(false),
                isCurrencyExchanger: fb.control(false),
                isEntrepreneur: fb.control(false),
                isEmployed: fb.control(false),
                isOther: fb.control(false),
                hasMlmExperience: fb.control(null, requiredBooleanValidator()),
            })
        );

        this.control('isInvestor').addValidators(
            oneRequiredValidator(this.formGroup, ['hasMlmExperience'])
        );
        this.control('isInvestor').updateValueAndValidity();

        Object.keys(this.formGroup.controls).forEach((key) => {
            if (key !== 'hasMlmExperience' && key !== 'isInvestor') {
                this.control(key).valueChanges.subscribe(() => {
                    this.clearError(this.control('isInvestor'));
                    this.control('isInvestor').updateValueAndValidity();
                });
            }
        });
    }

    ngOnInit(): void {
        this.initData();
        this.scrollService.enableScroll = true;
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    initData() {
        this.route.data.subscribe((data) => {
            this.me = data.me;
            this.setFormValues(this.formGroup, this.me.userQuestionnaire);
            this.control('hasMlmExperience').setValue(
                this.me.userQuestionnaire.hasMlmExperience
            );
        });
        this.route.parent.data.subscribe((data) => {
            this.pageErrors = data.page.errors;
            this.page = data.page;
        });
    }

    prepareRequest(): Observable<any> {
        const data = this.formGroup.getRawValue();
        if (this.control('hasMlmExperience').value) {
            data.trustLevel = null;
            data.isStartTeam = null;
        } else {
            data.projectName = null;
            data.partnersCount = null;
        }
        return this.userService.update({ userQuestionnaire: data });
    }

    onRequestSuccess(value: UserModel): void {
        this.router.navigateByUrl('/acc/form/step-three');
    }

    clickPrevStep() {
        this.router.navigateByUrl('/acc/form');
    }
}
