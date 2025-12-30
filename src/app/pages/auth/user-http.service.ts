import { inject, Injectable } from '@angular/core';
import { HttpResponseInterface } from './interfaces';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { CoreService } from '@utils/services/core.service';

@Injectable({
    providedIn: 'root'
})
export class UserHttpService {
    private readonly _httpClient = inject(HttpClient);
    private readonly _apiUrl = `${environment.API_URL}/users`;
    private readonly _customMessageService = inject(CustomMessageService);
    protected readonly _coreService = inject(CoreService);

    findAll() {
        return this._httpClient.get<HttpResponseInterface>(`${this._apiUrl}`).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    findPersonalInformation(id: string) {
        return this._httpClient.get<HttpResponseInterface>(`${this._apiUrl}/${id}/personal-information`).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    findBankDetail(id: string) {
        return this._httpClient.get<HttpResponseInterface>(`${this._apiUrl}/${id}/bank-detail`).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    updatePersonalInformation(id: string, payload: any) {
        return this._httpClient.put<HttpResponseInterface>(`${this._apiUrl}/${id}/personal-information`, payload).pipe(
            tap((response) => {
            })
        );
    }

    updateEmail(id: string, email: string) {
        return this._httpClient.patch<HttpResponseInterface>(`${this._apiUrl}/${id}/email`, { email }).pipe(
            tap((response) => {
            })
        );
    }

    updateBankDetail(id: string, payload: any) {
        return this._httpClient.put<HttpResponseInterface>(`${this._apiUrl}/${id}/bank-detail`, payload).pipe(
            tap((response) => {
            })
        );
    }
}
