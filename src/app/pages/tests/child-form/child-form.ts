import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';

@Component({
    selector: 'app-child-form',
    imports: [InputText, ReactiveFormsModule],
    templateUrl: './child-form.html',
    styleUrl: './child-form.scss'
})
export class ChildForm {
    //Dependencies - libraries - APIS
    formBuilder = inject(FormBuilder);

    // group varios campo a la vez
    userForm: FormGroup = this.formBuilder.group({
        name: [null],
        email: []
    });
}
