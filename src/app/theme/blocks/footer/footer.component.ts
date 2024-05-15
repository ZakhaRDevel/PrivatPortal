import { Component, Input, OnInit } from '@angular/core';
import { PageModel } from 'src/app/data/models/page.models';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
    @Input() page: PageModel;

    isDarkFooter: boolean = false;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isDarkFooter = this.router.url.slice(0, 10) === '/acc/store';

        this.router.events.subscribe((val) => {
            this.isDarkFooter = this.router.url.slice(0, 10) === '/acc/store';
        });

        // this.activatedRoute.url.subscribe((urlPath) => {
        //     // const url = urlPath[urlPath.length - 1].path;
        // })
    }
}
