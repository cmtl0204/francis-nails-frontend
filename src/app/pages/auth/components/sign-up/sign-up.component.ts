import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
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
import { invalidEmailMINTURValidator, invalidEmailValidator, unregisteredUserValidator, userExistValidator } from '@utils/form-validators/custom-validator';
import { InputOtp } from 'primeng/inputotp';
import { KeyFilter } from 'primeng/keyfilter';
import { MY_ROUTES } from '@routes';
import { JsonPipe } from '@angular/common';
import { Fluid } from 'primeng/fluid';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, ReactiveFormsModule, DatePickerModule, Message, LabelDirective, ErrorMessageDirective, InputOtp, KeyFilter, JsonPipe, Fluid]
})
export default class SignUpComponent {
    @Output() outForm = new EventEmitter(true);
    protected readonly environment = environment;
    private readonly _formBuilder = inject(FormBuilder);
    private readonly _customMessageService = inject(CustomMessageService);
    private readonly _authHttpService = inject(AuthHttpService);
    protected readonly _coreService = inject(CoreService);
    protected readonly PrimeIcons = PrimeIcons;
    protected form!: FormGroup;
    protected formErrors: string[] = [];
    protected transactionalCodeControl = new FormControl({ value: '', disabled: true }, [Validators.required]);
    protected isValidTransactionalCode = false;

    constructor() {
        this.buildForm();

        this.identificationField.valueChanges.subscribe((value) => {
            this.transactionalCodeControl.reset();
            this.transactionalCodeControl.disable();
            this.emailField.reset();
            this.emailField.enable();
            this.passwordField.reset();
            this.isValidTransactionalCode = false;

            if (value?.length === 13) {
                // this.verifyIdentification();
            }
        });

        this.transactionalCodeControl.valueChanges.subscribe((value) => {
            if (value?.length === 6) {
                this.verifyTransactionalCode();
            }
        });
    }

    private buildForm() {
        this.form = this._formBuilder.group({
            email: [null, [Validators.required, invalidEmailValidator(), invalidEmailMINTURValidator()]],
            password: [null, [Validators.required, Validators.minLength(8)]],
            name: [null, [Validators.required]],
            identification: [
                null,
                {
                    validators: [Validators.required, Validators.minLength(10), Validators.maxLength(13)],
                    asyncValidators: [userExistValidator(this._authHttpService)]
                }
            ]
        });
    }

    protected onSubmit() {
        if (!this.validateForm()) {
            this.form.markAllAsTouched();
            this._customMessageService.showFormErrors(this.formErrors);
            return;
        }

        this.signUpExternal();
    }

    private signUpExternal() {
        this.emailField.enable();

        this._authHttpService.signUpExternal(this.form.value).subscribe({
            next: (response) => {
                this.form.reset();
                this.outForm.emit(false);
            }
        });
    }

    private verifyRUC() {
        this._authHttpService.verifyRUC(this.identificationField.value).subscribe({});
        this.nameField.patchValue('hola');
    }

    protected requestTransactionalCode() {
        this.emailField.disable();
        this.transactionalCodeControl.enable();
    }

    protected verifyTransactionalCode() {
        this._authHttpService.verifyTransactionalCode(this.transactionalCodeControl.value!, this.emailField.value).subscribe({});
        this.isValidTransactionalCode = true;
    }

    private validateForm() {
        this.formErrors = [];

        if (this.nameField.invalid) this.formErrors.push('Nombre');
        if (this.emailField.invalid) this.formErrors.push('Correo Electrónico');
        if (this.passwordField.invalid) this.formErrors.push('Contraseña');
        if (this.identificationField.invalid) this.formErrors.push('RUC');

        return this.formErrors.length === 0 && this.form.valid;
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

    protected readonly MY_ROUTES = MY_ROUTES;
}
