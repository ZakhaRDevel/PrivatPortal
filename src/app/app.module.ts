import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgSelectModule } from '@ng-select/ng-select';
import { MatDialogModule } from '@angular/material/dialog';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';
import { CoreModule } from './core/core.module';
import { TokenInterceptor } from './core/interseptors/token.interceptor';

@NgModule({
    declarations: [AppComponent],
    imports: [
        CoreModule.forRoot(),
        BrowserModule.withServerTransition({ appId: 'serverApp' }),
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        NgSelectModule,
        MatDialogModule,
        PerfectScrollbarModule,
        OverlayscrollbarsModule,
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
