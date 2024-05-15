import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageModel } from 'src/app/data/models/page.models';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
    page: PageModel;
    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.data.subscribe((data) => {
            this.page = data.page;
        });
    }
}
