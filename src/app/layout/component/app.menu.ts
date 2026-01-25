import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { MY_ROUTES } from '@routes';
import { Ripple } from 'primeng/ripple';
import { AuthService } from '@modules/auth/auth.service';
import { RoleEnum } from '@utils/enums';
import { AuthHttpService } from '@/pages/auth/auth-http.service';
import { FontAwesome } from '@/api/font-awesome';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule, Ripple],
    template: `
        <ul class="layout-menu">
            @for (item of model; track item.id) {
                <ng-container>
                    @if (!item.separator) {
                        <li app-menuitem [item]="item" [index]="$index" [root]="true"></li>
                    }

                    @if (item.separator) {
                        <li class="menu-separator"></li>
                    }
                </ng-container>
            }
        </ul>

        <div class="mt-auto">
            <hr class="mb-4 mx-4 border-t border-0 border-surface" />

            <a (click)="signOut()" pRipple class="m-4 flex items-center cursor-pointer p-4 gap-2 rounded-border text-surface-700 dark:text-surface-100 hover:bg-surface-100 dark:hover:bg-surface-700 duration-150 transition-colors p-ripple">
                <i [class]="FontAwesome.POWER_OFF_SOLID" style="color:red "></i>
                <span class="font-bold" style="color: red"> Cerrar Sesión </span>
            </a>
        </div>
    `
})
export class AppMenu implements OnInit {
    protected readonly authService = inject(AuthService);
    protected readonly authHttpService = inject(AuthHttpService);

    protected model: MenuItem[] = [];
    protected readonly FontAwesome = FontAwesome;
    private readonly router = inject(Router);

    get loadMenu(): MenuItem[] {
        switch (this.authService.role.code) {
            case RoleEnum.ADMIN:
                return this.adminMenu;
            case RoleEnum.OWNER:
                return this.ownerMenu;
            case RoleEnum.CUSTOMER:
                return this.customerMenu;
            default:
                return [];
        }
    }

    get adminMenu(): MenuItem[] {
        return [
            {
                label: 'Usuarios',
                icon: FontAwesome.USERS_SOLID,
                routerLink: [MY_ROUTES.adminPages.user.absolute]
            }
        ];
    }

    get ownerMenu(): MenuItem[] {
        return [
            {
                label: 'Citas',
                icon: FontAwesome.CALENDAR_SOLID,
                routerLink: [MY_ROUTES.corePages.owner.appointments.absolute]
            }
        ];
    }

    get customerMenu(): MenuItem[] {
        return [
            {
                label: 'Mis Citas',
                icon: FontAwesome.CALENDAR_SOLID,
                routerLink: [MY_ROUTES.corePages.owner.appointments.absolute]
            },
            {
                label: 'Cancelar Cita',
                icon: FontAwesome.CALENDAR_XMARK_SOLID,
                routerLink: [MY_ROUTES.corePages.owner.appointments.absolute]
            }
        ];
    }

    ngOnInit() {
        this.model = [
            {
                label: 'Menú',
                items: [
                    { label: 'Dashboard', icon: FontAwesome.HOUSE_REGULAR, routerLink: ['/'] },
                    {
                        label: this.authService.auth.username,
                        icon: FontAwesome.ID_CARD_CLIP_SOLID,
                        routerLink: [MY_ROUTES.adminPages.user.profile.absolute]
                    },
                    ...this.loadMenu
                ]
            }
        ];
    }

    signOut() {
        this.authHttpService.signOut().subscribe();
    }
}
