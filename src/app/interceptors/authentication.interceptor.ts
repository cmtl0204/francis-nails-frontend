import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { switchMap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CoreService } from '@utils/services/core.service';
import { AuthService } from '@modules/auth/auth.service';
import { Router } from '@angular/router';
import { MY_ROUTES } from '@routes';
import { AuthHttpService } from '@/pages/auth/auth-http.service';

export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
    const coreService = inject(CoreService);
    const authService = inject(AuthService);
    const authHttpService = inject(AuthHttpService);
    const router = inject(Router);

    return next(req).pipe(
        catchError((error) => {
            if (error.status === 401 && !authService.refreshToken) {
                console.log('Unauthorized');
                authService.removeLogin();
            }

            if (error.status === 401 && authService.refreshToken) {
                console.log('2');
                // Cuando el usuario no está autenticado o el token expiró
                return authHttpService.refreshToken().pipe(
                    switchMap((response) => {
                        authService.accessToken = response.data.accessToken;
                        authService.refreshToken = response.data.refreshToken;

                        // Reintentar request original con token nuevo
                        return next(
                            req.clone({
                                setHeaders: {
                                    Authorization: authService.accessToken
                                }
                            })
                        );
                    }),
                    catchError(() => {
                        authService.removeLogin();
                        return throwError(() => error);
                    })
                );
                // authService.removeLogin();
            }

            // Cuando el usuario no tiene permisos para acceder al recurso solicitado y se encuentra logueado
            if (error.status === 403 && authService.accessToken) {
                switch (error.error.code) {
                    case 'INSUFFICIENT_PERMISSIONS':
                        break;
                    case 'ACCOUNT_SUSPENDED':
                        authService.removeLogin();
                        break;
                    case 'ACCOUNT_LOCKED':
                        authService.removeLogin();
                        break;
                }
            }

            // Cuando el usuario no tiene permisos para acceder al recurso solicitado y no está logueado
            if (error.status === 403 && !authService.accessToken) {
                authService.removeLogin();
            }

            // Cuando la aplicación o una ruta está en mantenimiento
            if (error.status === 503) {
                authService.removeLogin();
                coreService.serviceUnavailable = error.error.data;
                router.navigateByUrl(MY_ROUTES.signIn);
            }

            return throwError(() => error);
        })
    );
};
