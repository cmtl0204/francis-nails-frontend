import { inject, Injectable } from '@angular/core';

import { environment } from '@env/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { CoreService } from '@utils/services/core.service';
import { HttpResponseInterface, UpdateUserDto } from '@/pages/auth/interfaces';

@Injectable({
    providedIn: 'root'
})
export class UserHttpService {
    protected readonly _coreService = inject(CoreService);
    private readonly _httpClient = inject(HttpClient);
    private readonly _apiUrl = `${environment.API_URL}/auth/users`;
    private readonly _customMessageService = inject(CustomMessageService);

    findAll(page: number = 1, search: string = '') {
        let params = new HttpParams().set('page', page.toString());

        if (search) {
            params = params.append('search', search);
        }

        return this._httpClient.get<HttpResponseInterface>(this._apiUrl, { params }).pipe(
            map((response) => {
                return response;
            })
        );
    }

    findOne(id: string) {
        return this._httpClient.get<HttpResponseInterface>(`${this._apiUrl}/${id}`).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    create(payload: UpdateUserDto) {
        return this._httpClient.post<HttpResponseInterface>(`${this._apiUrl}`, payload);
    }

    update(id: string, payload: UpdateUserDto) {
        return this._httpClient.patch<HttpResponseInterface>(`${this._apiUrl}/${id}`, payload);
    }

    suspend(id: string) {
        return this._httpClient.patch<HttpResponseInterface>(`${this._apiUrl}/${id}/suspend`, null);
    }

    activate(id: string) {
        return this._httpClient.patch<HttpResponseInterface>(`${this._apiUrl}/${id}/activate`, null);
    }

    delete(id: string) {
        return this._httpClient.delete<HttpResponseInterface>(`${this._apiUrl}/${id}`);
    }

    updateProfile(id: string, payload: UpdateUserDto) {
        return this._httpClient.patch<HttpResponseInterface>(`${this._apiUrl}/${id}/profile`, payload);
    }

    updateAvatar(id: string, file: File) {
        const form = new FormData();
        form.append('avatar', file);

        return this._httpClient.post<HttpResponseInterface>(`${this._apiUrl}/${id}/avatar`, form).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    findProfile(id: string) {
        return this._httpClient.get<HttpResponseInterface>(`${this._apiUrl}/${id}/profile`).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    findCatalogueRoles() {
        return this._httpClient.get<HttpResponseInterface>(`${this._apiUrl}/roles/catalogues`).pipe(
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
        return this._httpClient.put<HttpResponseInterface>(`${this._apiUrl}/${id}/personal-information`, payload).pipe(tap((response) => {}));
    }

    updateEmail(id: string, email: string) {
        return this._httpClient.patch<HttpResponseInterface>(`${this._apiUrl}/${id}/email`, { email }).pipe(tap((response) => {}));
    }

    updateBankDetail(id: string, payload: any) {
        return this._httpClient.put<HttpResponseInterface>(`${this._apiUrl}/${id}/bank-detail`, payload).pipe(tap((response) => {}));
    }
}
