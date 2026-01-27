import { Component, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AppTopbar } from './app.topbar';
import { AppSidebar } from './app.sidebar';
import { LayoutService } from '@layout/service';
import { Divider } from 'primeng/divider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Message } from 'primeng/message';
import { environment } from '@env/environment';
import { MY_ROUTES } from '@routes';
import { FontAwesome } from '@/api/font-awesome';
import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [CommonModule, RouterModule, Divider, FormsModule, Message, ReactiveFormsModule, Button, Tooltip],
    styles: [
        `
            .login-page {
                /* 1. Asegurar que ocupe toda la pantalla */
                position: fixed; /* Faltaba esto para que top/left funcionen */
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;

                /* 2. Imagen y comportamiento */
                background-image: url('/development/auth/images/background.png');
                background-repeat: no-repeat; /* Evita que se repita si la pantalla es gigante */
                background-position: center center; /* CLAVE: Mantiene el centro de la imagen visible siempre */

                /* 3. Responsividad (Tu ya tenías esto, es correcto) */
                background-size: cover;

                /* Opcional: Para evitar scrollbars si el contenido se sale */
                overflow: hidden;
            }

            .box {
                opacity: 0.85; /* 50% de opacidad */
            }
        `
    ],
    template: `
        <div class="login-page min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div
                class="box w-full max-w-6xl bg-white rounded-xl shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-2">
                <!-- COLUMNA IZQUIERDA -->
                <div class="p-6 lg:p-10 flex flex-col justify-center">
                    <!-- Logo / Header -->
                    <div class="mb-2 flex justify-center">
                        <img [src]="environment.PATH_ASSETS + '/auth/images/logo.png'" alt="" class="mx-auto" />
                    </div>

                    <!-- Contenido dinámico -->
                    <!-- Aquí renderizas varios componentes -->
                    <ng-content select="[left-content]">
                        <router-outlet />
                        <p-button [label]="environment.VERSION" pTooltip="Versión del sistema"
                                  [icon]="FontAwesome.CODE_BRANCH_SOLID" [text]="true" />
                    </ng-content>
                </div>

                <!-- COLUMNA DERECHA -->
                <div class="bg-surface-100 p-6 lg:p-10 flex flex-col justify-center">
                    <!-- Bloque informativo superior -->
                    <div class="mb-6">
                        <ng-content select="[right-header]">
                            <div class="font-semibold text-xl text-center">{{ environment.APP_NAME }}</div>

                            <p-divider />

                            <p-message severity="secondary">
                                <div class="text-sm font-semibold">
                                    <p><b>Dirección:</b> Nela Martínez y Antonio Castelo.</p>
                                    <p>
                                        <b>Teléfono:</b>
                                        <a href="https://api.whatsapp.com/message/ADZVUOCMU742B1"
                                           target="_blank"
                                           class="hover:var(--primary-color) transition-250">
                                            +593 97 862 7513
                                        </a>
                                    </p>
                                    <p>
                                        <b>Correo electrónico:</b>
                                        <a href="mailto:info@francis-nails.com"> info&#64;francis-nails.com</a>
                                    </p>
                                </div>
                            </p-message>
                        </ng-content>
                    </div>

                    <!-- Listado / pasos / información -->
                    <div class="space-y-6">
                        <ng-content select="[right-content]">
                            <div class="flex flex-col gap-2">
                                <a target="_blank" [routerLink]="[MY_ROUTES.publicPages.appointments.absolute]">
                                    <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
                                        <div class="md:col-span-2 flex flex-col gap-2">
                                            <i [class]="FontAwesome.CALENDAR_CHECK_REGULAR"
                                               style="font-size: 2rem;color:var(--text-color-secondary)"></i>
                                        </div>
                                        <div class="md:col-span-10 flex flex-col gap-2">
                                            <h6 class="mb-5" style="var(--text-color-secondary)">¿Quieres Agendar?</h6>
                                            <p>Agendar</p>
                                        </div>
                                    </div>
                                </a>
                                <p-divider />

                                <a target="_blank" [href]="environment.PATH_ASSETS + '/files/auth/services.pdf'">
                                    <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
                                        <div class="md:col-span-2 flex flex-col gap-2">
                                            <i [class]="FontAwesome.LIST_UL_SOLID"
                                               style="font-size: 2rem;color:var(--text-color-secondary)"></i>
                                        </div>
                                        <div class="md:col-span-10 flex flex-col gap-2">
                                            <h6 class="mb-5" style="var(--text-color-secondary)">Servicios</h6>
                                            <p>Catalogo de Servicios</p>
                                        </div>
                                    </div>
                                </a>
                                <p-divider />

                                <a target="_blank" [href]="environment.PATH_ASSETS + '/auth/files/legal.pdf'">
                                    <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
                                        <div class="md:col-span-2 flex flex-col gap-2">
                                            <i [class]="FontAwesome.FILE_CONTRACT_SOLID"
                                               style="font-size: 2rem;color:var(--text-color-secondary)"></i>
                                        </div>
                                        <div class="md:col-span-10 flex flex-col gap-2">
                                            <h6 class="mb-5" style="var(--text-color-secondary)">TÉRMINOS Y
                                                CONDICIONES</h6>
                                            <p>Términos y Condiciones del Sistema</p>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </ng-content>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class AppLayoutAuth {
    overlayMenuOpenSubscription: Subscription;
    menuOutsideClickListener: any;
    @ViewChild(AppSidebar) appSidebar!: AppSidebar;
    @ViewChild(AppTopbar) appTopBar!: AppTopbar;
    protected readonly environment = environment;
    protected readonly MY_ROUTES = MY_ROUTES;

    constructor(
        public layoutService: LayoutService,
        public renderer: Renderer2,
        public router: Router
    ) {
        this.overlayMenuOpenSubscription = this.layoutService.overlayOpen$.subscribe(() => {
            if (!this.menuOutsideClickListener) {
                this.menuOutsideClickListener = this.renderer.listen('document', 'click', (event) => {
                    if (this.isOutsideClicked(event)) {
                        this.hideMenu();
                    }
                });
            }

            if (this.layoutService.layoutState().staticMenuMobileActive) {
                this.blockBodyScroll();
            }
        });

        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
            this.hideMenu();
        });
    }

    get containerClass() {
        return {
            'layout-overlay': this.layoutService.layoutConfig().menuMode === 'overlay',
            'layout-static': this.layoutService.layoutConfig().menuMode === 'static',
            'layout-static-inactive': this.layoutService.layoutState().staticMenuDesktopInactive && this.layoutService.layoutConfig().menuMode === 'static',
            'layout-overlay-active': this.layoutService.layoutState().overlayMenuActive,
            'layout-mobile-active': this.layoutService.layoutState().staticMenuMobileActive
        };
    }

    isOutsideClicked(event: MouseEvent) {
        const sidebarEl = document.querySelector('.layout-sidebar');
        const topbarEl = document.querySelector('.layout-menu-button');
        const eventTarget = event.target as Node;

        return !(sidebarEl?.isSameNode(eventTarget) || sidebarEl?.contains(eventTarget) || topbarEl?.isSameNode(eventTarget) || topbarEl?.contains(eventTarget));
    }

    hideMenu() {
        this.layoutService.layoutState.update((prev) => ({ ...prev, overlayMenuActive: false, staticMenuMobileActive: false, menuHoverActive: false }));
        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
            this.menuOutsideClickListener = null;
        }
        this.unblockBodyScroll();
    }

    blockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.add('blocked-scroll');
        } else {
            document.body.className += ' blocked-scroll';
        }
    }

    unblockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        } else {
            document.body.className = document.body.className.replace(new RegExp('(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    ngOnDestroy() {
        if (this.overlayMenuOpenSubscription) {
            this.overlayMenuOpenSubscription.unsubscribe();
        }

        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
        }
    }

    protected readonly FontAwesome = FontAwesome;
}
