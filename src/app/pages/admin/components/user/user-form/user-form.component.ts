import { Component, inject, input, OnInit } from '@angular/core';
import { UserHttpService } from '@/pages/admin/user-http.service';
import { PrimeIcons } from 'primeng/api';
import { BreadcrumbService } from '@layout/service';
import { CustomMessageService } from '@utils/services';
import { Router } from '@angular/router';
import { MY_ROUTES } from '@routes';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Fluid } from 'primeng/fluid';
import { LabelDirective } from '@utils/directives/label.directive';
import { InputText } from 'primeng/inputtext';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { Message } from 'primeng/message';
import { Button } from 'primeng/button';
import { invalidEmailValidator, passwordPolicesValidator, userExistValidator } from '@utils/form-validators/custom-validator';
import { Password } from 'primeng/password';
import { generatePassword } from '@utils/helpers/password-generate.helper';
import { RoleInterface } from '@/pages/auth/interfaces';
import { MultiSelect } from 'primeng/multiselect';
import { RoleHttpService } from '@/pages/admin/role-http.service';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Divider } from 'primeng/divider';
import { AuthHttpService } from '@/pages/auth/auth-http.service';
import { AutoFocus } from 'primeng/autofocus';
import { Tag } from 'primeng/tag';

@Component({
    selector: 'app-user-form',
    imports: [Fluid, ReactiveFormsModule, LabelDirective, InputText, ErrorMessageDirective, Message, Button, Password, MultiSelect, ToggleSwitch, FormsModule, Divider, AutoFocus, Tag],
    templateUrl: './user-form.component.html',
    styleUrl: './user-form.component.scss'
})
export default class UserFormComponent implements OnInit {
    protected readonly PrimeIcons = PrimeIcons;

    protected form!: FormGroup;
    protected id = input.required<string>();
    protected roles: RoleInterface[] = [];
    protected passwordActivated = new FormControl(false);

    protected readonly router = inject(Router);
    protected readonly customMessageService = inject(CustomMessageService);
    private readonly authHttpService = inject(AuthHttpService);
    private readonly userHttpService = inject(UserHttpService);
    private readonly roleHttpService = inject(RoleHttpService);
    private readonly breadcrumbService = inject(BreadcrumbService);
    private readonly formBuilder = inject(FormBuilder);

    constructor() {
        this.breadcrumbService.setItems([{ label: 'Listado de Usuarios', routerLink: MY_ROUTES.adminPages.user.absolute }, { label: 'Formulario' }]);

        this.loadRoles();
        this.buildForm();
    }

    get identificationField(): AbstractControl {
        return this.form.controls['identification'];
    }

    get nameField(): AbstractControl {
        return this.form.controls['name'];
    }

    get lastnameField(): AbstractControl {
        return this.form.controls['lastname'];
    }

    get emailField(): AbstractControl {
        return this.form.controls['email'];
    }

    get passwordField(): AbstractControl {
        return this.form.controls['password'];
    }

    get passwordChangedField(): AbstractControl {
        return this.form.controls['passwordChanged'];
    }

    get rolesField(): AbstractControl {
        return this.form.controls['roles'];
    }

    get usernameField(): AbstractControl {
        return this.form.controls['username'];
    }

    ngOnInit() {
        if (this.id()) {
            this.passwordField.disable();
            this.find(this.id());
            this.identificationField.setAsyncValidators(userExistValidator(this.authHttpService, this.id()));
        } else {
            this.passwordActivated.setValue(true);
            this.passwordField.enable();
        }

        this.passwordActivated.valueChanges.subscribe((value) => {
            if (value) {
                this.passwordField.enable();
            } else {
                this.passwordField.disable();
            }

            this.passwordField.updateValueAndValidity();
        });
    }

    loadRoles() {
        this.roleHttpService.findCatalogues().subscribe({
            next: (response) => {
                this.roles = response;
            }
        });
    }

    buildForm() {
        this.form = this.formBuilder.group({
            identification: [
                null,
                {
                    validators: [Validators.required],
                    asyncValidators: [userExistValidator(this.authHttpService)],
                    updateOn: 'blur'
                }
            ],
            username: [null, [Validators.required]],
            password: [null, [Validators.required, passwordPolicesValidator()]],
            passwordChanged: [false],
            name: [null, [Validators.required]],
            lastname: [null, [Validators.required, Validators.minLength(3)]],
            email: [null, [Validators.required, invalidEmailValidator()]],
            roles: [null, [Validators.required]]
        });

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.identificationField.valueChanges.subscribe((value) => {
            this.usernameField.setValue(value);
        });
    }

    find(id: string) {
        this.userHttpService.findOne(id).subscribe({
            next: (response: any) => {
                this.form.patchValue(response);
            }
        });
    }

    onSubmit() {
        if (this.validateForm()) {
            if (this.id()) {
                this.update();
            } else {
                this.create();
            }
        }
    }

    create() {
        this.userHttpService.create(this.form.value).subscribe({
            next: (_) => {
                this.router.navigate([MY_ROUTES.adminPages.user.absolute]);
            }
        });
    }

    update() {
        this.userHttpService.update(this.id(), this.form.value).subscribe({
            next: (_) => {
                this.router.navigate([MY_ROUTES.adminPages.user.absolute]);
            }
        });
    }

    validateForm() {
        const errors: string[] = [];

        if (this.identificationField.invalid) errors.push('Identificación');
        if (this.nameField.invalid) errors.push('Nombres');
        if (this.lastnameField.invalid) errors.push('Apellidos');
        if (this.emailField.invalid) errors.push('Email');
        if ((this.passwordActivated && this.passwordField.invalid) || (!this.id() && this.passwordField.invalid)) errors.push('Contraseña');
        if (this.rolesField.invalid) errors.push('Roles');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }

    return() {
        this.router.navigate([MY_ROUTES.adminPages.user.absolute]);
    }

    async autoGeneratePassword() {
        this.passwordField.patchValue(generatePassword({ length: 8 }));
        await navigator.clipboard.writeText(this.passwordField.value);
        this.customMessageService.showSuccess({ summary: 'Contraseña copiada', detail: this.passwordField.value });
    }
}
