import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { Dialog } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { PrimeIcons } from 'primeng/api';
import { DatePickerModule } from 'primeng/datepicker';
import { Message } from 'primeng/message';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { AuthHttpService } from '../../auth-http.service';
import { environment } from '@env/environment';
import { AuthService } from '@modules/auth/auth.service';
import { LabelDirective } from '@utils/directives/label.directive';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { MY_ROUTES } from '@routes';
import { invalidEmailValidator } from '@utils/form-validators/custom-validator';
import { RoleInterface } from '@modules/auth/interfaces';
import { Fluid } from 'primeng/fluid';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, ReactiveFormsModule, DatePickerModule, Message, LabelDirective, ErrorMessageDirective, Dialog, Fluid]
})
export default class SignInComponent {
    protected readonly environment = environment;
    private readonly formBuilder = inject(FormBuilder);
    private readonly customMessageService = inject(CustomMessageService);
    private readonly authHttpService = inject(AuthHttpService);
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    protected readonly PrimeIcons = PrimeIcons;
    protected form!: FormGroup;
    protected roles: RoleInterface[] = [];
    protected roleControl = new FormControl(null);
    protected isVisibleRoles = false;
    protected readonly MY_ROUTES = MY_ROUTES;
    protected readonly Validators = Validators;

    constructor() {
        this.buildForm();
    }

    private buildForm() {
        this.form = this.formBuilder.group({
            username: [null, [Validators.required]],
            password: [null, [Validators.required]]
        });
    }

    protected onSubmit() {
        if (this.validateForm()) {
            this.signIn();
        }
    }

    private validateForm() {
        const errors: string[] = [];

        if (this.usernameField.invalid) errors.push('Correo Electrónico');
        if (this.passwordField.invalid) errors.push('Contraseña');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }

    private signIn() {
        this.roleControl.reset();

        this.authHttpService.signIn(this.form.value).subscribe({
            next: (data) => {
                if (data.roles.length === 1) {
                    this.router.navigate([MY_ROUTES.dashboards.absolute]);
                    return;
                }

                this.roles = data.roles;
                this.roleControl.setValidators([Validators.required]);
                this.isVisibleRoles = true;
            }
        });
    }

    protected selectRole(value: RoleInterface) {
        this.authService.role = value;
        this.router.navigate([MY_ROUTES.dashboards.absolute]);
    }

    protected closeRoleSelect() {
        this.authHttpService.signOut().subscribe();
    }

    protected get usernameField(): AbstractControl {
        return this.form.controls['username'];
    }

    protected get passwordField(): AbstractControl {
        return this.form.controls['password'];
    }
}
