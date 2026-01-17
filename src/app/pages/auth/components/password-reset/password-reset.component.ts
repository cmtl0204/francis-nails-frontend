import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { AuthHttpService } from '../../auth-http.service';
import { environment } from '@env/environment';
import { PrimeIcons } from 'primeng/api';
import { CoreService } from '@utils/services/core.service';
import { DatePickerModule } from 'primeng/datepicker';
import { Message } from 'primeng/message';
import { LabelDirective } from '@utils/directives/label.directive';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { InputOtp } from 'primeng/inputotp';
import { MY_ROUTES } from '@routes';
import { invalidEmailMINTURValidator, invalidEmailValidator, passwordPolicesValidator, unregisteredUserValidator } from '@utils/form-validators/custom-validator';
import { Fluid } from 'primeng/fluid';

@Component({
    selector: 'app-password-reset',
    templateUrl: './password-reset.component.html',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, ReactiveFormsModule, DatePickerModule, Message, LabelDirective, ErrorMessageDirective, InputOtp, Fluid]
})
export default class PasswordResetComponent {
    protected readonly MY_ROUTES = MY_ROUTES;
    protected readonly environment = environment;
    protected readonly coreService = inject(CoreService);
    protected readonly PrimeIcons = PrimeIcons;
    protected form!: FormGroup;
    protected transactionalCodeControl = new FormControl({ value: '', disabled: true }, [Validators.required]);
    protected isValidTransactionalCode = false;
    private readonly formBuilder = inject(FormBuilder);
    private readonly customMessageService = inject(CustomMessageService);
    private readonly authHttpService = inject(AuthHttpService);
    private readonly router = inject(Router);

    constructor() {
        this.buildForm();
    }

    protected get emailField(): AbstractControl {
        return this.form.controls['email'];
    }

    protected get passwordField(): AbstractControl {
        return this.form.controls['password'];
    }

    protected get identificationField(): AbstractControl {
        return this.form.controls['identification'];
    }

    protected get nameField(): AbstractControl {
        return this.form.controls['name'];
    }

    protected verifyRegisteredUser() {
        this.authHttpService.verifyRegisteredUser(this.identificationField.value).subscribe({
            next: (response) => {
                this.emailField.setValue(response.email);
            }
        });
    }

    protected watchFormChanges() {
        this.identificationField.valueChanges.subscribe((value) => {
            this.transactionalCodeControl.reset();
            this.transactionalCodeControl.disable();
            this.passwordField.reset();
            this.passwordField.disable();

            if (!this.identificationField.errors) {
                this.verifyRegisteredUser();
            }
        });

        this.emailField.valueChanges.subscribe((value) => {
            this.transactionalCodeControl.reset();
            this.transactionalCodeControl.disable();
            this.passwordField.reset();
            this.passwordField.disable();
        });

        this.transactionalCodeControl.valueChanges.subscribe((value) => {
            if (value?.length === 6) {
                this.verifyTransactionalCode();
            }
        });
    }

    protected onSubmit() {
        if (this.validateForm()) {
            this.resetPassword();
        }
    }

    protected requestTransactionalCode() {
        this.nameField.disable();
        this.passwordField.disable();

        this.transactionalCodeControl.reset();
        this.transactionalCodeControl.disable();

        this.authHttpService.requestTransactionalPasswordResetCode(this.identificationField.value).subscribe({
            next: (_) => {
                this.transactionalCodeControl.enable();
            }
        });
    }

    protected verifyTransactionalCode() {
        this.isValidTransactionalCode = false;

        this.authHttpService.verifyTransactionalCode(this.transactionalCodeControl.value!, this.identificationField.value).subscribe({
            next: (_) => {
                this.transactionalCodeControl.reset();
                this.transactionalCodeControl.disable();
                this.passwordField.enable();
            }
        });
    }

    private buildForm() {
        this.form = this.formBuilder.group({
            email: [
                {
                    value: null,
                    disabled: true
                },
                [Validators.required, invalidEmailValidator(), invalidEmailMINTURValidator()]
            ],
            password: [null, [Validators.required, passwordPolicesValidator()]],
            name: [null, [Validators.required]],
            identification: [
                null,
                {
                    validators: [Validators.required, Validators.minLength(10), Validators.maxLength(13)],
                    asyncValidators: [unregisteredUserValidator(this.authHttpService)]
                }
            ]
        });

        this.emailField.disable();
        this.nameField.disable();
        this.passwordField.disable();

        this.watchFormChanges();
    }

    private resetPassword() {
        this.authHttpService.resetPassword(this.identificationField.value, this.passwordField.value).subscribe({
            next: () => {
                this.form.reset();
                this.router.navigate([MY_ROUTES.signIn]);
            }
        });
    }

    private validateForm() {
        const errors: string[] = [];

        if (this.emailField.invalid) errors.push('Correo Electrónico');
        if (this.passwordField.invalid) errors.push('Contraseña');
        if (this.identificationField.invalid) errors.push('RUC');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }
}
