import { Component, effect, inject, QueryList, signal, ViewChildren, WritableSignal } from '@angular/core';
import { PrimeIcons } from 'primeng/api';
import { ChildParkFormEnum, CoreEnum } from '@utils/enums';
import { CoreSessionStorageService, CustomMessageService } from '@utils/services';
import { ParkHttpService } from '@modules/core/roles/external/services/park-http.service';
import { collectFormErrors } from '@utils/helpers/collect-form-errors.helper';
import { ChildrenListFormComponent } from '@/pages/tests/children-list-form/children-list-form.component';
import { Button } from 'primeng/button';

@Component({
    selector: 'app-parent-form',
    imports: [ChildrenListFormComponent, Button],
    templateUrl: './parent-form.html',
    styleUrl: './parent-form.scss'
})
export class ParentForm {
    @ViewChildren(ChildrenListFormComponent) private childrenListFormComponent!: QueryList<ChildrenListFormComponent>;

    protected readonly CoreEnum = CoreEnum;
    protected readonly ChildParkFormEnum = ChildParkFormEnum;
    protected readonly PrimeIcons = PrimeIcons;
    private readonly coreSessionStorageService = inject(CoreSessionStorageService);
    private readonly parksHttpService = inject(ParkHttpService);
    private readonly customMessageService = inject(CustomMessageService);

    private mainData: WritableSignal<Record<string, any>> = signal({});
    protected modelId?: string;

    protected dataIn!: any;

    constructor() {
        effect(async () => {
            const process = this.coreSessionStorageService.processSignal();

            if (!process) return;

            const candidates = [process.classification, process.category];
            const regulated = candidates.find((c) => c?.hasRegulation);

            if (regulated) {
                this.modelId = regulated.id;
            }
        });
    }

    async ngOnInit(): Promise<void> {
        await this.loadDataIn();
    }

    private async loadDataIn() {
        this.dataIn = await this.coreSessionStorageService.getEncryptedValue(CoreEnum.step3);
    }

    protected saveForm(data: any, objectName?: string) {
        this.mainData.update((currentData) => {
            let newData = { ...currentData };

            if (objectName) {
                // Actualiza una sub-propiedad de forma inmutable
                newData[objectName] = {
                    ...(newData[objectName] ?? {}),
                    ...data
                };
            } else {
                // Actualiza el objeto principal
                newData = { ...currentData, ...data };
            }

            return newData;
        });
    }

    protected async onSubmit() {
        if (this.checkFormErrors()) {
            await this.saveProcess();
        }
    }

    private async saveProcess() {
        await this.coreSessionStorageService.setEncryptedValue(CoreEnum.step3, this.mainData());

        const process = await this.coreSessionStorageService.getEncryptedValue(CoreEnum.process);

        console.log(this.mainData());
        console.log(await this.coreSessionStorageService.getEncryptedValue(CoreEnum.step3));

        const payload = { ...this.mainData(), ...process };

        // console.log(payload);

        // this.parksHttpService.createRegistration(payload).subscribe({
        //     next: () => {}
        // });
    }

    private checkFormErrors() {
        const errors = collectFormErrors([this.childrenListFormComponent]);

        if (errors.length) {
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }
}
