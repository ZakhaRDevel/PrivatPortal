import { Component, Input, OnInit } from '@angular/core';
import { CoreService } from 'src/app/core/services/core.service';

@Component({
    selector: 'app-btn-loader',
    templateUrl: './btn-loader.component.html',
    styleUrls: ['./btn-loader.component.scss'],
})
export class BtnLoaderComponent implements OnInit {
    @Input() isSubmitted: boolean;
    @Input() isAccount: boolean = false;
    @Input() isAuth: boolean = false;

    constructor(public coreService: CoreService) {}

    ngOnInit(): void {}
}
