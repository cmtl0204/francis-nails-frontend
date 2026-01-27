import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { AuthHttpService } from '../../auth-http.service';
import { environment } from '@env/environment';
import { DatePickerModule } from 'primeng/datepicker';
import { Message } from 'primeng/message';
import { LabelDirective } from '@utils/directives/label.directive';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { invalidEmailMINTURValidator, invalidEmailValidator, passwordPolicesValidator, unavailableUserValidator } from '@utils/form-validators/custom-validator';
import { InputOtp } from 'primeng/inputotp';
import { KeyFilter } from 'primeng/keyfilter';
import { MY_ROUTES } from '@routes';
import { Fluid } from 'primeng/fluid';
import { CatalogueService } from '@utils/services/catalogue.service';
import { CatalogueTypeEnum, CoreEnum } from '@utils/enums';
import { Tooltip } from 'primeng/tooltip';
import { FontAwesome } from '@/api/font-awesome';
import { CatalogueHttpService, CoreSessionStorageService } from '@utils/services';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, ReactiveFormsModule, DatePickerModule, Message, LabelDirective, ErrorMessageDirective, InputOtp, KeyFilter, Fluid, Tooltip]
})
export default class SignUpComponent implements OnInit {
    protected readonly environment = environment;

    protected form!: FormGroup;
    protected transactionalCodeControl = new FormControl({ value: '', disabled: true }, [Validators.required]);
    protected readonly MY_ROUTES = MY_ROUTES;
    protected readonly FontAwesome = FontAwesome;
    private readonly formBuilder = inject(FormBuilder);
    private readonly customMessageService = inject(CustomMessageService);
    private readonly coreSessionStorageService = inject(CoreSessionStorageService);
    private readonly catalogueHttpService = inject(CatalogueHttpService);
    private readonly catalogueService = inject(CatalogueService);
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

    protected get usernameField(): AbstractControl {
        return this.form.controls['username'];
    }

    protected get termsAcceptedAtField(): AbstractControl {
        return this.form.controls['termsAcceptedAt'];
    }

    protected get securityQuestionsField(): FormArray {
        return this.form.controls['securityQuestions'] as FormArray;
    }

    async ngOnInit() {
        await this.loadSecurityQuestions();
    }

    protected async loadSecurityQuestions() {
        this.catalogueHttpService.findCache().subscribe({
            next: async (response) => {
                await this.coreSessionStorageService.setEncryptedValue(CoreEnum.catalogues, response);

                let allSecurityQuestions = await this.catalogueService.findByType(CatalogueTypeEnum.users_security_question);

                console.log(allSecurityQuestions);
                const selectedSecurityQuestions = allSecurityQuestions
                    .map((value) => ({ value, sort: Math.random() })) // 1. Asignamos un valor aleatorio a cada uno
                    .sort((a, b) => a.sort - b.sort) // 2. Ordenamos por ese valor aleatorio
                    .map(({ value }) => value) // 3. Recuperamos el objeto original
                    .slice(0, 3); // 4. Tomamos los 3 primeros

                selectedSecurityQuestions.forEach((q) => this.addQuestion(q));
            }
        });
    }

    protected openTerms() {
        window.open(`${environment.PATH_ASSETS}/auth/files/legal.pdf`, '_blank');
    }

    protected addQuestion(question: any): void {
        const group = this.formBuilder.group({
            code: [question.code, Validators.required],
            question: [question.name, Validators.required],
            answer: [null, Validators.required]
        });

        this.securityQuestionsField.push(group);
    }

    protected watchFormChanges() {
        this.identificationField.valueChanges.subscribe((value) => {
            this.transactionalCodeControl.reset();
            this.transactionalCodeControl.disable();
            this.emailField.reset();
            this.emailField.enable();
            this.passwordField.reset();
            this.passwordField.disable();
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

    protected requestTransactionalCode() {
        this.nameField.disable();
        this.passwordField.disable();

        this.transactionalCodeControl.reset();
        this.transactionalCodeControl.disable();

        this.authHttpService.requestTransactionalSignupCode(this.emailField.value).subscribe({
            next: (_) => {
                this.transactionalCodeControl.enable();
            }
        });
    }

    protected verifyTransactionalCode() {
        this.authHttpService.verifyTransactionalCode(this.transactionalCodeControl.value!, this.emailField.value).subscribe({
            next: (_) => {
                this.transactionalCodeControl.reset();
                this.transactionalCodeControl.disable();
                this.nameField.enable();
                this.passwordField.enable();
            }
        });
    }

    protected onSubmit() {
        this.usernameField.setValue(this.identificationField.value);

        if (this.validateForm()) {
            this.signUpExternal();
        }
    }

    private buildForm() {
        this.form = this.formBuilder.group({
            email: [null, [Validators.required, invalidEmailValidator(), invalidEmailMINTURValidator()]],
            password: [null, [Validators.required, passwordPolicesValidator()]],
            name: [null, [Validators.required]],
            username: [null, [Validators.required]],
            termsAcceptedAt: [false, [Validators.requiredTrue]],
            identification: [
                null,
                {
                    validators: [Validators.required, Validators.minLength(10), Validators.maxLength(13)],
                    asyncValidators: [unavailableUserValidator(this.authHttpService)]
                }
            ],
            securityQuestions: this.formBuilder.array([])
        });

        this.emailField.disable();
        this.nameField.disable();
        this.passwordField.disable();

        this.watchFormChanges();
    }

    private signUpExternal() {
        this.authHttpService.signUpExternal(this.form.value).subscribe({
            next: (_) => {
                this.form.reset();
                this.router.navigate([MY_ROUTES.signIn]);
            }
        });
    }

    private validateForm() {
        const errors: string[] = [];

        if (this.nameField.invalid) errors.push('Nombres');
        if (this.emailField.invalid) errors.push('Correo Electrónico');
        if (this.passwordField.invalid) errors.push('Contraseña');
        if (this.identificationField.invalid) errors.push('Identificación');
        if (this.termsAcceptedAtField.invalid) errors.push('Términos y Condiciones');

        const invalidSecurityQuestions = this.securityQuestionsField.controls.some((ctrl) => ctrl.get('answer')?.invalid);
        if (invalidSecurityQuestions) errors.push('Preguntas de seguridad');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }
}
