import { Component, inject, input, InputSignal, OnInit, output, OutputEmitterRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Fluid } from 'primeng/fluid';
import { ConfirmationService, MenuItem, PrimeIcons } from 'primeng/api';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Message } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { DatePicker } from 'primeng/datepicker';
import { InputNumber } from 'primeng/inputnumber';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { LabelDirective } from '@utils/directives/label.directive';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { CatalogueInterface, ColInterface } from '@utils/interfaces';
import { deleteButtonAction, editButtonAction } from '@utils/components/button-action/consts';
import { ListBasicComponent } from '@utils/components/list-basic/list-basic.component';
import { dateGreaterThan } from '@utils/form-validators/custom-validator';
import { CatalogueTypeEnum } from '@utils/enums';
import { CatalogueService } from '@utils/services/catalogue.service';
import { Select } from 'primeng/select';

@Component({
    selector: 'app-children-list-form',
    imports: [Fluid, ReactiveFormsModule, DatePicker, LabelDirective, Message, ErrorMessageDirective, ToggleSwitch, TableModule, Button, Dialog, InputText, ListBasicComponent, InputNumber, Select],
    templateUrl: './children-list-form.component.html',
    styleUrls: ['./children-list-form.component.scss']
})
export class ChildrenListFormComponent implements OnInit {
    public dataIn: InputSignal<any> = input<any>();
    public dataOut: OutputEmitterRef<any> = output<any>();

    protected readonly PrimeIcons = PrimeIcons;

    protected readonly catalogueService = inject(CatalogueService);
    protected readonly customMessageService = inject(CustomMessageService);
    private confirmationService = inject(ConfirmationService);

    private readonly formBuilder = inject(FormBuilder);
    protected form!: FormGroup;
    protected itemForm!: FormGroup;

    protected items: any[] = [];
    protected cols: ColInterface[] = [];
    protected buttonActions: MenuItem[] = [];
    protected isVisibleModal = false;
    protected index = -1;

    protected dpaTypes: CatalogueInterface[] = [];

    constructor() {
        this.buildForm();
    }

    async ngOnInit() {
        await this.loadCatalogues();
        this.loadData();
        this.buildColumns();
    }

    loadData() {
        if (this.dataIn()) {
            this.form.patchValue(this.dataIn());
        }
    }

    async loadCatalogues() {
        this.dpaTypes = await this.catalogueService.findByType(CatalogueTypeEnum.MARITAL_STATUS);// es solo un ejemplo, tipo deberia ir en minusculas
    }

    buildForm() {
        this.form = this.formBuilder.group({
            hasMaritimeTransport: [false, [Validators.required]],
            other: [null, [Validators.required, Validators.minLength(3)]],
            items: []
        });

        this.itemForm = this.formBuilder.group(
            {
                id: [null],
                totalUnits: [null, [Validators.required]],
                totalSeats: [null, [Validators.required]],
                certifiedCode: [null, [Validators.required]],
                certifiedIssueAt: [null, [Validators.required]],
                certifiedExpirationAt: [null, [Validators.required]],
                dpaType: [null, [Validators.required]],
                processType: [null, [Validators.required]]
            },
            {
                validators: dateGreaterThan('certifiedIssueAt', 'certifiedExpirationAt')
            }
        );

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.form.valueChanges.subscribe((_) => {
            this.dataOut.emit(this.form.value);
        });
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if (this.hasMaritimeTransportField.value && this.items.length === 0) errors.push('Transporte Marítimo');

        if(this.otherField.invalid) errors.push('Other');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
        }

        return errors;
    }

    buildButtonActions({ index }: { index: number }) {
        this.index = index;

        if (this.index < 0) {
            this.customMessageService.showError({ summary: 'El registro no existe', detail: 'Vuelva a intentar' });
            return;
        }

        this.buttonActions = [
            {
                ...editButtonAction,
                command: () => {
                    this.editItem(this.index);
                }
            },
            {
                ...deleteButtonAction,
                command: () => {
                    this.deleteItem(this.index);
                }
            }
        ];
    }

    buildColumns() {
        this.cols = [
            { header: 'Número o Código de la Matrícula de Armador', field: 'certifiedCode' },
            { header: 'Número de unidades de transporte', field: 'totalUnits' },
            { header: 'Total, número de puesto', field: 'totalSeats' },
            { header: 'Fecha de emisión de la Matrícula de Armador', field: 'certifiedIssueAt', type: 'date' },
            { header: 'Fecha de Caducidad de la Matrícula de Armador', field: 'certifiedExpirationAt', type: 'date' }
        ];
    }

    validateItemForm() {
        const errors: string[] = [];

        if (this.totalUnitsField.invalid) errors.push('Número de unidades de transporte');
        if (this.totalSeatsField.invalid) errors.push('Total, número de puesto');
        if (this.certifiedCodeField.invalid) errors.push('Número o Código de la Matrícula de Armador');
        if (this.certifiedIssueAtField.invalid) errors.push('Fecha de emisión de la Matrícula de Armador');
        if (this.certifiedExpirationAtField.invalid) errors.push('Fecha de Caducidad de la Matrícula de Armador');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }

    createItem() {
        this.isVisibleModal = true;
    }

    editItem(index: number) {
        console.log('entroo');
        console.log(index);
        if (index > -1) {
            this.itemForm.patchValue(this.items[index]);
        }

        this.isVisibleModal = true;
    }

    deleteItem(index: number) {
        this.confirmationService.confirm({
            message: '¿Está seguro de eliminar?',
            header: 'Eliminar',
            icon: PrimeIcons.TRASH,
            rejectButtonStyleClass: 'p-button-text',
            rejectButtonProps: {
                label: 'Cancelar',
                severity: 'danger',
                text: true
            },
            acceptButtonProps: {
                label: 'Sí, Eliminar'
            },
            accept: () => {
                this.items.splice(index, 1);

                this.itemsField.setValue(this.items);
            },
            key: 'confirmdialog'
        });
    }

    saveItem() {
        if (this.index < 0) {
            this.items.push(this.itemForm.value);
        } else {
            this.items[this.index] = this.itemForm.value;
        }

        this.itemsField.setValue(this.items);

        this.closeModal();
    }

    closeModal() {
        this.isVisibleModal = false;
        this.idField.reset();
        this.totalUnitsField.reset();
        this.totalSeatsField.reset();
        this.certifiedCodeField.reset();
        this.certifiedIssueAtField.reset();
        this.certifiedExpirationAtField.reset();
    }

    onSubmit() {
        if (this.validateItemForm()) {
            this.saveItem();
        }
    }

    get idField(): AbstractControl {
        return this.itemForm.controls['id'];
    }

    get totalUnitsField(): AbstractControl {
        return this.itemForm.controls['totalUnits'];
    }

    get totalSeatsField(): AbstractControl {
        return this.itemForm.controls['totalSeats'];
    }

    get certifiedCodeField(): AbstractControl {
        return this.itemForm.controls['certifiedCode'];
    }

    get certifiedIssueAtField(): AbstractControl {
        return this.itemForm.controls['certifiedIssueAt'];
    }

    get certifiedExpirationAtField(): AbstractControl {
        return this.itemForm.controls['certifiedExpirationAt'];
    }

    get dpaTypeField(): AbstractControl {
        return this.itemForm.controls['dpaType'];
    }

    get processTypeField(): AbstractControl {
        return this.itemForm.controls['processType'];
    }

    get hasMaritimeTransportField(): AbstractControl {
        return this.form.controls['hasMaritimeTransport'];
    }

    get itemsField(): AbstractControl {
        return this.form.controls['items'];
    }

    get otherField(): AbstractControl {
        return this.form.controls['other'];
    }
}
