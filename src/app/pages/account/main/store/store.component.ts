import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageModel } from 'src/app/data/models/page.models';

@Component({
    selector: 'app-store',
    templateUrl: './store.component.html',
    styleUrls: ['./store.component.scss'],
})
export class StoreComponent implements OnInit {
    page: PageModel;

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.data.subscribe((data) => {
            this.page = data.page;
        });
    }
}
