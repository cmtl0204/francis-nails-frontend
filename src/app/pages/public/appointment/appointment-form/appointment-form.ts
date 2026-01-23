import {
    Component,
    effect,
    inject,
    input,
    InputSignal,
    OnDestroy,
    OnInit,
    output,
    OutputEmitterRef
} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimeIcons } from 'primeng/api';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { CatalogueService } from '@utils/services/catalogue.service';
import { Fluid } from 'primeng/fluid';
import { LabelDirective } from '@utils/directives/label.directive';
import { Message } from 'primeng/message';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { InputText } from 'primeng/inputtext';
import { DatePicker } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { environment } from '@env/environment';
import { AppointmentHttpService } from '@/pages/public/appointment/services';
import { debounceTime, distinctUntilChanged, filter, from, Subject, switchMap, takeUntil } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';
import { CoreService } from '@utils/services';
import { Textarea } from 'primeng/textarea';

@Component({
    selector: 'app-appointment-form',
    imports: [
        ReactiveFormsModule,
        Fluid,
        LabelDirective,
        Message,
        ErrorMessageDirective,
        InputText,
        DatePicker,
        Select,
        Textarea
    ],
    templateUrl: './appointment-form.html',
    styleUrl: './appointment-form.scss',
})
export class AppointmentForm implements OnInit, OnDestroy {
    public dataIn: InputSignal<any> = input<any>();
    public submitted: InputSignal<boolean> = input.required<boolean>();
    public dataOut: OutputEmitterRef<any> = output<any>();


    protected readonly environment = environment;

    protected readonly catalogueService = inject(CatalogueService);
    protected readonly customMessageService = inject(CustomMessageService);
    protected readonly coreService = inject(CoreService);
    private readonly formBuilder = inject(FormBuilder);
    protected form!: FormGroup;
    protected services: string[] = ['Manicura','Depilado de cejas'];
    protected currentDate = new Date();
    private readonly appointmentHttpService = inject(AppointmentHttpService);
    private destroy$ = new Subject<void>();

    constructor() {
        this.buildForm();

        effect(() => {
            this.submitted();
            this.form.reset();
        });
    }

    get identificationField(): AbstractControl {
        return this.form.controls['identification'];
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

    get notesField(): AbstractControl {
        return this.form.controls['notes'];
    }

    async ngOnInit() {
        await this.loadCatalogues();
        this.loadData();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
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
            identification: [null, [Validators.required, Validators.minLength(9)]],
            name: [null, [Validators.required]],
            email: [null, [Validators.email]],
            phone: [null, [Validators.required]],
            service: [null, [Validators.required]],
            date: [null, [Validators.required]],
            notes: [null],
        });

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.form.valueChanges.subscribe((_) => {
            this.dataOut.emit(this.form.value);
        });

        // this.identificationField.valueChanges.pipe(
        //     debounceTime(300),
        //     map(v => v?.trim() ?? ''),
        //     distinctUntilChanged(),
        //     filter(v => v.length >=9),
        //
        //     tap(() => {
        //         this.coreService.showProcessing();
        //     }),
        //
        //     switchMap(v =>
        //         from(this.appointmentHttpService.findByIdentification(v)).pipe(
        //             finalize(() => {
        //                 this.coreService.hideProcessing();
        //             })
        //         )
        //     ),
        //
        //     tap(customer => {
        //         if (!customer) {
        //             this.form.patchValue({
        //                 name: null,
        //                 email: null,
        //                 phone: null
        //             });
        //             return;
        //         }
        //
        //         this.form.patchValue({
        //             name: customer['name'] ?? null,
        //             email: customer['email'] ?? null,
        //             phone: customer['phone'] ?? null
        //         });
        //     }),
        //
        //     takeUntil(this.destroy$)
        // ).subscribe();

    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if(this.identificationField.invalid) errors.push('Identificación');
        if(this.identificationField.valid){
        if(this.nameField.invalid) errors.push('Nombre del cliente');
        if(this.emailField.invalid) errors.push('Correo');
        if(this.phoneField.invalid) errors.push('Teléfono');
        if(this.serviceField.invalid) errors.push('Servicio');
        if(this.dateField.invalid) errors.push('Fecha de la cita');
        }
        if (errors.length > 0) {
            this.form.markAllAsTouched();
        }

        return errors;
    }

    ladingPage(){
        window.location.href = "https://www.francis-nails.com";
    }
}
