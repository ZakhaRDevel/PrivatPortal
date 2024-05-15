import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnnouncementArchiveComponent } from './announcement-archive/announcement-archive.component';
import { AnnouncementComponent } from './announcement.component';
import { AnnouncementItemComponent } from './announcement-item/announcement-item.component';
import { AnnouncementModel } from 'src/app/data/models/announcement.model';
import { AnnouncementResolver } from 'src/app/data/resolvers/announcement-resolver';
import { PageResolver } from 'src/app/data/resolvers/page.resolver';

const routes: Routes = [
    {
        path: '',
        component: AnnouncementComponent,
        resolve: {
            data: AnnouncementResolver,
            page: PageResolver,
        },
        data: {
            slug: 'announcements',
        },
        children: [
            {
                path: '',
                component: AnnouncementArchiveComponent,
                resolve: {
                    data: AnnouncementResolver,
                },
            },
            {
                path: ':id',
                component: AnnouncementItemComponent,
                resolve: {
                    data: AnnouncementResolver,
                },
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AnnouncementRoutingModule {}
