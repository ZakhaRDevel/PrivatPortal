import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LangService } from '../services/lang.service';

@Injectable({
    providedIn: 'root',
})
export abstract class ModelApiService {
    protected apiFrontUrl = environment.api.url + '/front';
    protected apiMeUrl = environment.api.url + '/me';

    constructor(
        protected http: HttpClient,
        protected langService: LangService
    ) {}
}
