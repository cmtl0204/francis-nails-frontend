import { Component, inject, OnInit } from '@angular/core';
import { ListComponent } from '@utils/components/list/list.component';
import { UserHttpService } from '@/pages/admin/user-http.service';
import { ColInterface, PaginationInterface } from '@utils/interfaces';
import { ConfirmationService, MenuItem, PrimeIcons } from 'primeng/api';
import { BreadcrumbService } from '@layout/service';
import { activateButtonAction, editButtonAction, suspendButtonAction } from '@utils/components/button-action/consts';
import { CustomMessageService } from '@utils/services';
import { Router } from '@angular/router';
import { MY_ROUTES } from '@routes';
import { UserInterface } from '@/pages/auth/interfaces';
import { AuthService } from '@/pages/auth/auth.service';
import { Fluid } from 'primeng/fluid';

@Component({
    selector: 'app-user-list',
    imports: [ListComponent, Fluid],
    templateUrl: './user-list.component.html',
    styleUrl: './user-list.component.scss'
})
export default class UserListComponent implements OnInit {
    protected readonly PrimeIcons = PrimeIcons;
    protected readonly customMessageService = inject(CustomMessageService);
    protected readonly router = inject(Router);
    protected index = -1;
    protected isVisibleModal = false;
    protected cols: ColInterface[] = [];
    protected items: UserInterface[] = [];
    protected pagination!: PaginationInterface;
    protected buttonActions: MenuItem[] = [];
    protected currentSearch: string = '';
    private confirmationService = inject(ConfirmationService);
    private readonly userHttpService = inject(UserHttpService);
    private readonly breadcrumbService = inject(BreadcrumbService);
    private readonly authService = inject(AuthService);

    constructor() {
        this.breadcrumbService.setItems([{ label: 'Listado de Usuarios' }]);

        this.buildColumns();
    }

    ngOnInit() {
        this.loadData();
    }

    loadData(page = 1) {
        this.userHttpService.findAll(page, this.currentSearch).subscribe({
            next: (response: any) => {
                this.items = response.data;
                this.pagination = response.pagination;
            }
        });
    }

    buildColumns() {
        this.cols = [
            { header: 'Identificación', field: 'identification' },
            { header: 'Nombres', field: 'name' },
            { header: 'Apellidos', field: 'lastname' },
            { header: 'Email', field: 'email' },
            { header: 'Roles', field: 'roles', type: 'arrayObject', objectName: 'name' }
        ];
    }

    buildButtonActions({ item, index }: { item: any; index: number }) {
        if (!item) {
            this.customMessageService.showError({ summary: 'El registro no existe', detail: 'Vuelva a intentar' });
            return;
        }

        this.buttonActions = [
            {
                ...editButtonAction,
                command: () => {
                    this.edit(item.id);
                }
            }
        ];

        if (this.authService.auth.id !== item.id) {
            if (item.suspendedAt) {
                this.buttonActions.push({
                    ...activateButtonAction,
                    command: () => {
                        this.activate(item.id, index);
                    }
                });
            } else {
                this.buttonActions.push({
                    ...suspendButtonAction,
                    command: () => {
                        this.suspend(item.id, index);
                    }
                });
            }
        }
    }

    edit(id: string) {
        this.router.navigate([MY_ROUTES.adminPages.user.form.absolute, id]);
    }

    suspend(id: string, index: number) {
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
                this.userHttpService.suspend(id).subscribe({
                    next: (_) => {
                        this.items[index].suspendedAt = new Date();
                    }
                });
            },
            key: 'confirmdialog'
        });
    }

    activate(id: string, index: number) {
        this.userHttpService.activate(id).subscribe({
            next: (_) => {
                this.items[index].suspendedAt = null;
            }
        });
    }

    onCreate() {
        this.router.navigate([MY_ROUTES.adminPages.user.form.absolute]);
    }

    onSearch(searchTerm: string) {
        this.currentSearch = searchTerm || '';
        this.loadData();
    }

    onPagination(page: number) {
        this.loadData(page);
    }
}
