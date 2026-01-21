import { Component, inject, output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { environment } from '@env/environment';
import { PrimeIcons } from 'primeng/api';
import { CoreService } from '@utils/services/core.service';
import { DatePickerModule } from 'primeng/datepicker';
import { MY_ROUTES } from '@routes';
import { LabelDirective } from '@utils/directives/label.directive';
import { JsonPipe } from '@angular/common';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { Message } from 'primeng/message';

@Component({
    selector: 'app-security-question',
    templateUrl: './security-question.component.html',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, ReactiveFormsModule, DatePickerModule, LabelDirective, JsonPipe, ErrorMessageDirective, Message]
})
export default class SecurityQuestionComponent {
    protected readonly MY_ROUTES = MY_ROUTES;
    protected readonly environment = environment;
    protected readonly coreService = inject(CoreService);
    protected readonly PrimeIcons = PrimeIcons;
    protected form!: FormGroup;
    private readonly formBuilder = inject(FormBuilder);
    private readonly customMessageService = inject(CustomMessageService);

    constructor() {
        this.buildForm();
    }

    protected get securityQuestionsField(): FormArray {
        return this.form.controls['securityQuestions'] as FormArray;
    }

    addQuestion(question: any): void {
        const group = this.formBuilder.group({
            question: [question, Validators.required],
            answer: ['', Validators.required]
        });

        this.securityQuestionsField.push(group);
    }

    protected watchFormChanges() {}

    private buildForm() {
        this.form = this.formBuilder.group({
            securityQuestions: this.formBuilder.array([])
        });

        this.addQuestion({ id: '1', name: 'Primera pregunta' });
        this.addQuestion({ id: '2', name: 'Segunda pregunta' });
        this.addQuestion({ id: '3', name: 'Tercera pregunta' });

        this.watchFormChanges();
    }

    public getFormErrors() {
        const errors: string[] = [];

        const invalid = this.securityQuestionsField.controls.some((ctrl) => ctrl.get('answer')?.invalid);

        if (invalid) errors.push('Preguntas de seguridad');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
        }

        return errors;
    }
}
