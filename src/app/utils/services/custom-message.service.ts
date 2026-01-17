import { inject, Injectable, signal } from '@angular/core';
import { MessageService, PrimeIcons } from 'primeng/api';

type Severity = 'success' | 'info' | 'warn' | 'danger' | 'help' | 'primary' | 'secondary' | 'contrast' | null | undefined;

@Injectable({
    providedIn: 'root'
})
export class CustomMessageService {
    private readonly _messageService = inject(MessageService);
    private _isModalVisible = signal(false);
    readonly modalVisible = this._isModalVisible.asReadonly();
    private _modalConfirmVisible: boolean = false;
    private _modalAcceptSeverity: Severity = null;
    private _modalRejectSeverity: Severity = 'danger';
    private _modalIcon: string = '';
    private _modalTitleIcon: string = '';
    private _modalIconColor: string = '';
    private _modalTitle: string = '';
    private _modalMessage: string | string[] = '';
    private _modalLife: number = 5000;

    showSuccess({ summary, detail }: { summary: string; detail: string }) {
        this._messageService.add({ severity: 'success', summary, detail });
    }

    showError({ summary, detail }: { summary: string; detail: string }) {
        this._modalLife = detail.length * 100;
        this._messageService.add({ severity: 'error', summary, detail });
    }

    showInfo({ summary, detail }: { summary: string; detail: string }) {
        this._messageService.add({ severity: 'info', summary, detail });
    }

    showWarning({ summary, detail }: { summary: string; detail: string }) {
        this._messageService.add({ severity: 'warn', summary, detail });
    }

    showHttpSuccess(response: string | string[] | any) {
        this._messageService.add({ severity: 'success', summary: response.title, detail: response.message });
    }

    showHttpError(error: string | string[] | any) {
        if (error) {
            this._modalLife = error.message.length * 100;

            if (Array.isArray(error.message)) {
                this._modalLife = error.message.length * 5000;
                error.message.sort();
            }

            this._messageService.add({ severity: 'error', summary: error.error, detail: error.message });
        }
    }

    showFormErrors(message: string | string[]): void {
        if (Array.isArray(message)) message.sort();

        this._isModalVisible.set(true);
        this._modalAcceptSeverity = 'info';
        this._modalIcon = PrimeIcons.TIMES;
        this._modalIconColor = 'red';
        this._modalTitle = 'Falta completar o existen errores en los siguientes campos';
        this._modalMessage = message;
    }

    showModalInfo({ summary, detail }: { summary: string; detail: string }): void {
        this._isModalVisible.set(true);
        this._modalAcceptSeverity = 'info';
        this._modalTitleIcon = PrimeIcons.INFO_CIRCLE;
        this._modalIconColor = 'var(--primary-color)';
        this._modalTitle = summary;
        this._modalMessage = detail;
    }

    showModalError({ summary, detail }: { summary: string; detail: string }): void {
        this._isModalVisible.set(true);
        this._modalAcceptSeverity = 'danger';
        this._modalTitleIcon = PrimeIcons.TIMES;
        this._modalIconColor = 'var(--p-red-500)';
        this._modalTitle = summary;
        this._modalMessage = detail;
    }

    showModalWarn({ summary, detail }: { summary: string; detail: string }): void {
        this._isModalVisible.set(true);
        this._modalAcceptSeverity = 'info';
        this._modalTitleIcon = PrimeIcons.EXCLAMATION_TRIANGLE;
        this._modalIconColor = 'var(--primary-color)';
        this._modalTitle = summary;
        this._modalMessage = detail;
    }

    get modalTitle(): string {
        return this._modalTitle;
    }

    get modalIcon(): string {
        return this._modalIcon;
    }

    get modalTitleIcon(): string {
        return this._modalTitleIcon;
    }

    get modalIconColor(): string {
        return this._modalIconColor;
    }

    get modalMessage(): string | string[] {
        return this._modalMessage;
    }

    get modalAcceptSeverity(): Severity {
        return this._modalAcceptSeverity;
    }

    get modalRejectSeverity(): Severity {
        return this._modalRejectSeverity;
    }

    setModalVisible(value: boolean) {
        this._isModalVisible.set(value);
    }

    get modalConfirmVisible(): boolean {
        return this._modalConfirmVisible;
    }

    set modalConfirmVisible(value: boolean) {
        this._modalConfirmVisible = value;
    }

    get modalLife(): number {
        return this._modalLife;
    }
}
