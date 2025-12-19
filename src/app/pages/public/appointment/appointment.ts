import { Component, inject, input, InputSignal, OnInit, output, OutputEmitterRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimeIcons } from 'primeng/api';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { CatalogueInterface } from '@utils/interfaces';
import { CatalogueTypeEnum } from '@utils/enums';
import { CatalogueService } from '@utils/services/catalogue.service';
import { Fluid } from 'primeng/fluid';
import { LabelDirective } from '@utils/directives/label.directive';
import { Message } from 'primeng/message';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { InputText } from 'primeng/inputtext';
import { DatePicker } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { environment } from '@env/environment';

@Component({
  selector: 'app-appointment',
  imports: [
      ReactiveFormsModule,
      Fluid,
      LabelDirective,
      Message,
      ErrorMessageDirective,
      InputText,
      DatePicker,
      Select
  ],
  templateUrl: './appointment.html',
  styleUrl: './appointment.scss',
})
export class Appointment implements OnInit{
    public dataIn: InputSignal<any> = input<any>();
    public dataOut: OutputEmitterRef<any> = output<any>();

    protected readonly PrimeIcons = PrimeIcons;

    protected readonly catalogueService = inject(CatalogueService);
    protected readonly customMessageService = inject(CustomMessageService);

    private readonly formBuilder = inject(FormBuilder);
    protected form!: FormGroup;

    protected services: string[] = ['Manicura','Depilado de cejas'];
    protected currentDate = new Date();

    constructor() {
        this.buildForm();
    }

    async ngOnInit() {
        await this.loadCatalogues();
        this.loadData();
    }

    loadData() {
        if (this.dataIn()) {
            this.form.patchValue(this.dataIn());
        }
    }

    async loadCatalogues() {
        // this.services = await this.catalogueService.findByType(CatalogueTypeEnum.activities_geographic_area);
    }

    buildForm() {
        this.form = this.formBuilder.group({
            name: [null, [Validators.required]],
            email: [null, [Validators.email]],
            phone: [null, [Validators.required]],
            service: [null, [Validators.required]],
            date: [null, [Validators.required]],
        });

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.form.valueChanges.subscribe((_) => {
            this.dataOut.emit(this.form.value);
        });
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if(this.nameField.invalid) errors.push('Nombre del cliente');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
        }

        return errors;
    }

    ladingPage(){
        window.location.href = "https://www.francis-nails.com";
    }
    get nameField(): AbstractControl {
        return this.form.controls['name'];
    }

    get emailField(): AbstractControl {
        return this.form.controls['email'];
    }

    get phoneField(): AbstractControl {
        return this.form.controls['phone'];
    }

    get serviceField(): AbstractControl {
        return this.form.controls['service'];
    }

    get dateField(): AbstractControl {
        return this.form.controls['date'];
    }

    protected readonly environment = environment;
}
