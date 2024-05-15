import {
    AfterViewInit,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiForm } from 'src/app/core/abstract/api-from';
import { ScrollService } from 'src/app/core/services/scroll.service';
import { PageModel } from 'src/app/data/models/page.models';
import { UserModel } from 'src/app/data/models/user.model';
import { UserService } from 'src/app/data/services/user.service';

@Component({
    selector: 'app-step-three',
    templateUrl: './step-three.component.html',
    styleUrls: ['../questionnare.component.scss'],
})
export class StepThreeComponent
    extends ApiForm
    implements OnInit, AfterViewInit
{
    icon = '*';
    formGroup: FormGroup;
    page: PageModel;
    pageErrors: PageModel;

    me: UserModel;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private userService: UserService,
        private route: ActivatedRoute,
        private scrollService: ScrollService
    ) {
        super(
            fb.group({
                partnersCount: fb.control(null),
                projectName: fb.control(''),
                isStartTeam: fb.control(''),
                trustLevel: fb.control(''),
            })
        );

        this.route.data.subscribe((data) => {
            this.me = data.me;
        });

        if (this.me.userQuestionnaire.hasMlmExperience) {
            this.control('projectName').addValidators(Validators.required);
            this.control('partnersCount').addValidators(Validators.required);
        } else {
            this.control('isStartTeam').addValidators(Validators.required);
            this.control('trustLevel').addValidators(Validators.required);
        }
    }

    ngOnInit(): void {
        this.initData();
        this.scrollService.enableScroll = true;
    }
    ngAfterViewInit(): void {}

    initData() {
        this.route.data.subscribe((data) => {
            this.me = data.me;
            this.setFormValues(this.formGroup, this.me.userQuestionnaire);
        });
        this.route.parent.data.subscribe((data) => {
            this.page = data.page;
            this.pageErrors = data.page.errors;
        });
    }

    prepareRequest(): Observable<any> {
        const data = this.formGroup.getRawValue();

        return this.userService.update({ userQuestionnaire: data });
    }

    onRequestSuccess(value: UserModel): void {
        this.router.navigateByUrl('/acc/form/step-four');
    }

    clickPrevStep() {
        this.router.navigateByUrl('/acc/form/step-two');
    }

    updateSlider(event) {
        this.control('trustLevel').setValue(event.value + '%');
    }
}
