import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { environment } from '@env/environment';
import { AuthService } from '@modules/auth/auth.service';
import { MY_ROUTES } from '@routes';
import { FontAwesome } from '@/api/font-awesome';
import { Fluid } from 'primeng/fluid';
import { NgClass } from '@angular/common';
import { AuthHttpService } from '@/pages/auth/auth-http.service';
import { Dialog } from 'primeng/dialog';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { LabelDirective } from '@utils/directives/label.directive';
import { Message } from 'primeng/message';
import { InputText } from 'primeng/inputtext';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomMessageService } from '@utils/services';

@Component({
    selector: 'app-email-verification',
    standalone: true,
    imports: [RouterModule, ButtonModule, Fluid, NgClass, Dialog, ErrorMessageDirective, LabelDirective, Message, InputText, ReactiveFormsModule, FormsModule],
    templateUrl: './email-verification.component.html',
    styles: [
        `
            .icon-color-info {
                color: var(--p-sky-600);
            }

            .icon-color-warn {
                color: var(--p-orange-600);
            }
            .icon-color-danger {
                color: var(--p-red-600);
            }
            .icon-color-success {
                color: var(--p-green-600);
            }

            .icon-color-help {
                color: var(--p-purple-600);
            }
        `
    ]
})
export default class EmailVerificationComponent implements OnInit, OnDestroy {
    token = input.required<string>();
    protected readonly environment = environment;
    protected readonly authService = inject(AuthService);
    protected readonly customMessageService = inject(CustomMessageService);
    protected readonly MY_ROUTES = MY_ROUTES;
    protected readonly FontAwesome = FontAwesome;
    protected icon: string = FontAwesome.SPINNER_SOLID;
    protected title: string = 'Verificando...';
    protected message: string = 'Estamos verificando tu cuenta';
    protected color: string = 'var(--p-sky-600)';
    protected iconColor: string = 'icon-color-info';
    protected error: string = '';
    protected counter: number = 5;
    protected requestEmailVerificationModal: boolean = false;
    protected usernameControl = new FormControl(null, [Validators.required]);
    protected readonly onsubmit = onsubmit;
    private readonly router = inject(Router);
    private readonly authHttpService = inject(AuthHttpService);
    private intervalId!: number;

    ngOnInit() {
        this.verifyEmail();
    }

    back() {
        this.router.navigate([MY_ROUTES.signIn]);
    }

    verifyEmail() {
        this.authHttpService.verifyEmail(this.token()).subscribe({
            next: (result) => {
                this.icon = FontAwesome.ENVELOPE_CIRCLE_CHECK_SOLID;
                this.title = '¡Verificación Exitosa!';
                this.message = 'Ya puedes iniciar sesión';
                this.color = 'var(--p-green-600)';
                this.iconColor = 'icon-color-success';
                this.error = '';

                this.intervalId = window.setInterval(() => {
                    this.counter--;

                    if (this.counter === 0) {
                        this.router.navigate([MY_ROUTES.signIn]);
                    }
                }, 1000);
            },
            error: (err) => {
                this.error = err.error.error;

                switch (err.error.error) {
                    case 'INVALID_TOKEN':
                        this.icon = FontAwesome.LINK_SLASH_SOLID;
                        this.title = 'Enlace no válido';
                        this.message = 'El enlace de verificación no es válido o ya no está disponible';
                        this.color = 'var(--p-red-600)';
                        this.iconColor = 'icon-color-danger';
                        break;
                    case 'USED_TOKEN':
                        this.icon = FontAwesome.USER_CHECK_SOLID;
                        this.title = 'Cuenta ya activa';
                        this.message = 'Este enlace de confirmación ya se utilizó anteriormente. Tu cuenta está activa.';
                        this.color = 'var(--p-purple-600)';
                        this.iconColor = 'icon-color-help';

                        this.intervalId = window.setInterval(() => {
                            this.counter--;

                            if (this.counter === 0) {
                                this.router.navigate([MY_ROUTES.signIn]);
                            }
                        }, 1000);
                        break;
                    case 'EXPIRED_TOKEN':
                        this.icon = FontAwesome.CALENDAR_XMARK_REGULAR;
                        this.title = 'El enlace ha caducado';
                        this.message = 'Por seguridad, los enlaces duran 24 horas. Necesitas generar uno nuevo.';
                        this.color = 'var(--p-orange-600)';
                        this.iconColor = 'icon-color-warn';
                        break;
                }
            }
        });
    }

    ngOnDestroy(): void {
        this.clearTimer();
    }

    resendEmailVerification() {
        if (this.usernameControl.valid) {
            this.authHttpService.requestVerifyEmail(this.usernameControl.value!).subscribe({
                next: (response) => {
                    this.usernameControl.reset();
                    this.requestEmailVerificationModal = false;

                    this.customMessageService.showModalInfo({
                        summary: `¡Solicitud recibida!`,
                        detail: 'Si la identificación está registrada en nuestro sistema, se ha enviado un correo con el nuevo enlace'
                    });
                }
            });
        }
    }

    private clearTimer(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }
}
