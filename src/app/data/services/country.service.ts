import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { ModelApiService } from '../../core/abstract/model-api.service';
import { CountryModel } from '../models/country.model';

@Injectable({
    providedIn: 'root',
})
export class CountryService extends ModelApiService {
    list(): Observable<CountryModel[]> {
        return this.http
            .get(`${this.apiFrontUrl}/country`)
            .pipe(
                map((data: { data: CountryModel[] }) =>
                    CountryModel.fromJsonArray(data.data)
                )
            );
    }
}
