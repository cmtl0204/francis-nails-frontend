import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { MY_ROUTES } from '@routes';
import { Ripple } from 'primeng/ripple';
import { AuthService } from '@modules/auth/auth.service';
import { RoleEnum } from '@utils/enums';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule, Ripple],
    template: `
        <ul class="layout-menu">
            <ng-container *ngFor="let item of model; let i = index">
                <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
                <li *ngIf="item.separator" class="menu-separator"></li>
            </ng-container>
        </ul>

        <div class="mt-auto">
            <hr class="mb-4 mx-4 border-t border-0 border-surface" />

            <a (click)="signOut()" pRipple class="m-4 flex items-center cursor-pointer p-4 gap-2 rounded-border text-surface-700 dark:text-surface-100 hover:bg-surface-100 dark:hover:bg-surface-700 duration-150 transition-colors p-ripple">
                <i [class]="PrimeIcons.POWER_OFF" style="color:red "></i>
                <span class="font-bold" style="color: red"> Cerrar Sesión </span>
            </a>
        </div>
    `
})
export class AppMenu implements OnInit {
    protected readonly authService = inject(AuthService);
    protected readonly PrimeIcons = PrimeIcons;
    protected model: MenuItem[] = [];
    private readonly _router = inject(Router);

    get loadMenu(): MenuItem[] {
        switch (this.authService.role.code) {
            case RoleEnum.ADMIN:
                return this.adminMenu;
            case RoleEnum.OWNER:
                return this.ownerMenu;
            default:
                return [];
        }
    }

    get adminMenu(): MenuItem[] {
        return [
            {
                label: 'Usuarios',
                icon: PrimeIcons.USERS,
                routerLink: [MY_ROUTES.adminPages.user.absolute]
            },
            {
                label: 'Mi Perfil',
                icon: PrimeIcons.ID_CARD,
                routerLink: [MY_ROUTES.adminPages.user.profile.absolute]
            }
        ];
    }

    get ownerMenu(): MenuItem[] {
        return [
            {
                label: 'Citas',
                icon: PrimeIcons.CALENDAR,
                routerLink: [MY_ROUTES.corePages.owner.appointments.absolute]
            }
        ];
    }

    ngOnInit() {
        this.model = [
            {
                label: 'APP',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                    ...this.loadMenu,
                    {
                        label: this.authService.auth.username,
                        icon: PrimeIcons.USER,
                        routerLink: [MY_ROUTES.adminPages.user.profile.absolute]
                    }
                ]
            }
        ];
    }

    signOut() {
        this.authService.removeLogin();
    }
}
