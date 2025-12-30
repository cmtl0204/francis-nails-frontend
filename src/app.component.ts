import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { CoreService } from '@utils/services/core.service';
import { MessageModalComponent } from '@utils/components/message-modal/message-modal.component';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { MessageProcessingComponent } from '@utils/components/message-processing/message-processing.component';
import { AppConfigurator } from '@layout/component/app.configurator';
import { FormsModule } from '@angular/forms';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { CatalogueHttpService, CoreSessionStorageService, DpaHttpService } from '@utils/services';
import { switchMap, tap } from 'rxjs/operators';
import { CoreEnum } from '@utils/enums';
import { ActivityHttpService } from '@modules/core/shared/services';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, ToastModule, MessageModalComponent, MessageProcessingComponent, AppConfigurator, FormsModule, ConfirmDialog],
    template: `
        @if (coreService.processing()) {
            <app-message-processing />
        }

        @if (customMessageService.modalVisible()) {
            <app-message-modal />
        }

        <p-toast position="top-right" [life]="customMessageService.modalLife" />

        <p-confirmdialog key="confirmdialog"></p-confirmdialog>

        <app-configurator />

        @if (loading) {
            <router-outlet />
        }
    `
})
export class AppComponent implements OnInit {
    protected readonly coreService = inject(CoreService);
    private readonly dpaHttpService = inject(DpaHttpService);
    private readonly activityHttpService = inject(ActivityHttpService);
    protected readonly catalogueHttpService = inject(CatalogueHttpService);
    protected readonly customMessageService = inject(CustomMessageService);
    private readonly coreSessionStorageService = inject(CoreSessionStorageService);
    protected loading: boolean = true;

    constructor() {}

    async ngOnInit() {
        this.catalogueHttpService
            .findCache()
            .pipe(
                tap(async (response) => {
                    await this.coreSessionStorageService.setEncryptedValue(CoreEnum.catalogues, response);
                }),
                switchMap(() => this.dpaHttpService.findCache()),
                tap(async (response) => {
                    await this.coreSessionStorageService.setEncryptedValue(CoreEnum.dpa, response);
                }),
                switchMap(() => this.activityHttpService.findCache()),
                tap(async (response) => {
                    await this.coreSessionStorageService.setEncryptedValue(CoreEnum.activities, response.data.activities);
                    await this.coreSessionStorageService.setEncryptedValue(CoreEnum.classifications, response.data.classifications);
                    await this.coreSessionStorageService.setEncryptedValue(CoreEnum.categories, response.data.categories);

                    this.loading = true;
                })
            )
            .subscribe();
    }
}
