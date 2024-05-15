import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PageModel } from 'src/app/data/models/page.models';
import { ModalCatalogComponent } from '../modal-catalog/modal-catalog.component';

@Component({
    selector: 'app-block-mobile-filter',
    templateUrl: './block-mobile-filter.component.html',
    styleUrls: ['./block-mobile-filter.component.scss'],
})
export class BlockMobileFilterComponent implements OnInit {
    @Input() page: PageModel;

    constructor(private matDialog: MatDialog, private router: Router) {}

    ngOnInit(): void {}

    openModalCatalog() {
        const dialog = this.matDialog.open(ModalCatalogComponent, {});

        dialog.afterClosed().subscribe((data) => {
            if (data) {
                this.router.navigate(['/acc/store'], {
                    queryParams: data,
                });
            }
        });
    }
}
