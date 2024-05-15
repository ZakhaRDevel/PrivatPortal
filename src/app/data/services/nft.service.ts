import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { ModelApiService } from '../../core/abstract/model-api.service';
import { NftModel } from '../models/nft.model';
import { UserNftModel } from '../models/user-nft.model';

@Injectable({
    providedIn: 'root',
})
export class NftService extends ModelApiService {
    list(): Observable<UserNftModel[]> {
        return this.http.get(`${this.apiMeUrl}/userNft`).pipe(
            map((data: UserNftModel[]) =>
                UserNftModel.fromJsonArray(data).map((itm) => {
                    itm.nft = NftModel.fromJson(itm.nft);
                    return itm;
                })
            )
        );
    }

    transfer(params: {
        userNftId: number;
        google2faCode: number;
    }): Observable<any> {
        return this.http.post(`${this.apiMeUrl}/userNft/transfer`, params);
    }
}
