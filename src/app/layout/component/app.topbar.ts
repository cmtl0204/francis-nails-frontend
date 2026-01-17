import { Component, inject } from '@angular/core';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '@layout/service';
import { environment } from '@env/environment';
import { AuthService } from '@modules/auth/auth.service';
import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';
import { MY_ROUTES } from '@routes';
import { AuthHttpService } from '@/pages/auth/auth-http.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, Button, Tooltip],
    template: ` <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo" routerLink="/">
                <img [src]="environment.PATH_ASSETS + '/logo.png'" alt="Logo" width="50px" />
                <span>{{ environment.APP_SHORT_NAME }}</span>
            </a>
        </div>

        <div class="layout-topbar-actions">
            <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    @if (authService.auth && authService.role) {
                        <p-button type="button" (onClick)="redirectProfile()" [text]="true" [raised]="true" [rounded]="true" [label]="authService.auth.username" pTooltip="Mi Perfil" [icon]="PrimeIcons.USER" />

                        <p-button type="button" [icon]="PrimeIcons.VERIFIED" [text]="true" [raised]="true" [rounded]="true" severity="warn" [label]="authService.role.name" pTooltip="Mi Rol" />
                    }
                    <p-button (onClick)="signOut()" type="button" [raised]="true" [rounded]="true" severity="danger" pTooltip="Cerrar Sesión" [icon]="PrimeIcons.POWER_OFF" />
                </div>
            </div>
        </div>
    </div>`
})
export class AppTopbar {
    protected readonly authService = inject(AuthService);
    protected readonly authHttpService = inject(AuthHttpService);
    private readonly router = inject(Router);
    items!: MenuItem[];

    constructor(public layoutService: LayoutService) {}

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    protected readonly environment = environment;
    protected readonly PrimeIcons = PrimeIcons;

    signOut() {
        this.authHttpService.signOut().subscribe();
    }

    redirectProfile() {
        this.router.navigate([MY_ROUTES.adminPages.user.profile.absolute]);
    }
}
