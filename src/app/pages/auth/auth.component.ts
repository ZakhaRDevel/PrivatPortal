import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import {UserModel} from "../../data/models/user.model";
import {AuthService} from "../../core/services/auth.service";
import {LoaderService} from "../../core/services/loader.service";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
    is_bgFourLights = false;
    authClass = true;

    get me(): UserModel {
        return this.authService.currentUser;
    }

    get homeLink(): string {
        return `/`;
    }

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        public loaderService: LoaderService
    ) {}

    ngOnInit(): void {
        if (this.router.url === '/login') {
            this.is_bgFourLights = true;
        } else {
            this.is_bgFourLights = false;
        }
        this.router.events.subscribe((val) => {
            if (this.router.url === '/login') {
                this.is_bgFourLights = true;
            } else {
                this.is_bgFourLights = false;
            }
        });
    }
}
