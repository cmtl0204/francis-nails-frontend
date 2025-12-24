import { inject, Injectable } from '@angular/core';
import { HttpResponseInterface, SignInInterface } from './interfaces';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '@modules/auth/auth.service';
import { SignInResponseInterface } from '@modules/auth/interfaces';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { Observable } from 'rxjs';
import { CatalogueHttpService, CoreService, CoreSessionStorageService, DpaHttpService } from '@utils/services';
import { CoreEnum } from '@utils/enums';
import { ActivityHttpService } from '@/pages/core/shared/services';
import { Auth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { doc, getDoc } from 'firebase/firestore';
@Injectable({
    providedIn: 'root'
})
export class AuthHttpService {
    private readonly authService = inject(AuthService);
    private readonly httpClient = inject(HttpClient);
    private readonly apiUrl = `${environment.API_URL}/auth`;
    private readonly customMessageService = inject(CustomMessageService);
    private readonly dpaHttpService = inject(DpaHttpService);
    protected readonly catalogueHttpService = inject(CatalogueHttpService);
    private readonly activityHttpService = inject(ActivityHttpService);
    private readonly coreSessionStorageService = inject(CoreSessionStorageService);
    private readonly coreService = inject(CoreService);

    private auth = inject(Auth);
    private firestore = inject(Firestore);
    private provider = new GoogleAuthProvider();

    async signInWithGoogle() {
        this.coreService.showProcessing();

        this.provider.setCustomParameters({ prompt: 'select_account' });

        const userCredentials = await signInWithPopup(this.auth, this.provider);

        const userRef = doc(this.firestore, 'users', userCredentials.user.uid);

        const response = (await getDoc(userRef)).data();

        if (response) {
            this.authService.accessToken = userCredentials.user.refreshToken;

            this.authService.auth = { id: response['id'], email: response['email'], username: response['username'] };

            this.authService.roles = response['roles'];

            if (response['roles'].length === 1) {
                this.authService.role = response['roles'][0];
            }
        }

        this.coreService.hideProcessing();
    }

    signIn(payload: SignInInterface) {
        const url = `${this.apiUrl}/sign-in`;

        return this.catalogueHttpService.findCache().pipe(
            tap(async (response) => await this.coreSessionStorageService.setEncryptedValue(CoreEnum.catalogues, response)),
            switchMap(() => this.dpaHttpService.findCache()),
            tap(async (response) => await this.coreSessionStorageService.setEncryptedValue(CoreEnum.dpa, response)),

            switchMap(() => this.activityHttpService.findCache()),
            tap(async (response) => {
                await this.coreSessionStorageService.setEncryptedValue(CoreEnum.activities, response.data.activities);
                await this.coreSessionStorageService.setEncryptedValue(CoreEnum.classifications, response.data.classifications);
                await this.coreSessionStorageService.setEncryptedValue(CoreEnum.categories, response.data.categories);
            }),
            switchMap(() => this.httpClient.post<SignInResponseInterface>(url, payload)),
            map((response) => {
                this.authService.accessToken = response.data.accessToken;

                this.authService.auth = response.data.auth;

                this.authService.roles = response.data.roles;

                if (response.data.roles.length === 1) {
                    this.authService.role = response.data.roles[0];
                }

                return response.data;
            })
        );

        // return this.httpClient.post<SignInResponseInterface>(url, payload).pipe(
        //     map((response) => {
        //         this.authService.accessToken = response.data.accessToken;
        //
        //         this.authService.auth = response.data.auth;
        //
        //         this.authService.roles = response.data.roles;
        //
        //         if (response.data.roles.length === 1) {
        //             this.authService.role = response.data.roles[0];
        //         }
        //
        //         return response.data;
        //     })
        // );
    }

    signUpExternal(payload: SignInInterface) {
        const url = `${this.apiUrl}/sign-up-external`;

        return this.httpClient.post<SignInResponseInterface>(url, payload).pipe(
            map((response) => {
                this.customMessageService.showSuccess({ summary: response.title, detail: response.message });

                return response;
            })
        );
    }

    requestTransactionalCode(username: string): Observable<HttpResponseInterface> {
        const url = `${this.apiUrl}/transactional-codes/${username}/request`;
        return this.httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => {
                this.customMessageService.showHttpSuccess(response);
                return response.data;
            })
        );
    }

    requestTransactionalEmailCode(email: string): Observable<HttpResponseInterface> {
        const url = `${this.apiUrl}/transactional-email-codes/${email}/request`;
        return this.httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => {
                this.customMessageService.showHttpSuccess(response);
                return response.data;
            })
        );
    }

    verifyTransactionalCode(token: string, username: string): Observable<HttpResponseInterface> {
        const url = `${this.apiUrl}/transactional-codes/${token}/verify`;
        return this.httpClient.patch<HttpResponseInterface>(url, { username }).pipe(
            map((response) => {
                this.customMessageService.showHttpSuccess(response);
                return response.data;
            })
        );
    }

    verifyIdentification(identification: string) {
        const url = `${this.apiUrl}/verify-identification/${identification}`;

        return this.httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    verifyRucPendingPayment(ruc: string) {
        const url = `${this.apiUrl}/verify-ruc-pending-payment/${ruc}`;

        return this.httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    verifyRUC(ruc: string) {
        const url = `${this.apiUrl}/verify-ruc/${ruc}`;

        return this.httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    acceptTermsConditions() {
        const url = `${this.apiUrl}/terms-conditions/accept`;

        return this.httpClient.patch<HttpResponseInterface>(url, null).pipe(
            map((response) => {
                this.authService.auth = { ...this.authService.auth, termsConditions: true };
                this.customMessageService.showHttpSuccess(response);
                return response.data;
            })
        );
    }

    rejectTermsConditions() {
        const url = `${this.apiUrl}/terms-conditions/reject`;

        return this.httpClient.patch<HttpResponseInterface>(url, null).pipe(
            map((response) => {
                this.customMessageService.showHttpSuccess(response);
                return response.data;
            })
        );
    }
}
