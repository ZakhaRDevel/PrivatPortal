import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from 'src/app/core/core.module';
import { AnnouncementComponent } from './announcement.component';
import { AnnouncementArchiveComponent } from './announcement-archive/announcement-archive.component';
import { AnnouncementItemComponent } from './announcement-item/announcement-item.component';
import { AnnouncementRoutingModule } from './announcement-routing.module';
import { ThemeModule } from 'src/app/theme/theme.module';

@NgModule({
    declarations: [
        AnnouncementComponent,
        AnnouncementArchiveComponent,
        AnnouncementItemComponent,
    ],
    imports: [
        CommonModule,
        AnnouncementRoutingModule,
        NgSelectModule,
        FormsModule,
        ReactiveFormsModule,
        CoreModule,
        ThemeModule,
    ],
})
export class AnnouncementModule {}
