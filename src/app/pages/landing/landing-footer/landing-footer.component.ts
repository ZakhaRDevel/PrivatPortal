import { Component, Input, OnInit } from '@angular/core';
import { PageModel } from 'src/app/data/models/page.models';
import { UserModel } from 'src/app/data/models/user.model';

@Component({
    selector: 'app-landing-footer',
    templateUrl: './landing-footer.component.html',
    styleUrls: ['./landing-footer.component.scss'],
})
export class LandingFooterComponent implements OnInit {
    @Input() user: UserModel;
    @Input() page: PageModel;

    constructor() {}

    ngOnInit(): void {}
}
