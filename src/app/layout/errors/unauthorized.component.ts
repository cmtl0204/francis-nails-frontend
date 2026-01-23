import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PrimeIcons } from 'primeng/api';
import { MY_ROUTES } from '@routes';
import { FontAwesome } from '@/api/font-awesome';

@Component({
    selector: 'app-unauthorized',
    standalone: true,
    imports: [RouterModule, ButtonModule],
    template: `
        <div class="flex items-center justify-center min-h-screen overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, color-mix(in srgb, var(--p-red-600), transparent 50%) 10%, var(--surface-ground) 90%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20 flex flex-col items-center" style="border-radius: 53px">
                        <span class="text-red-600 font-bold text-3xl">401</span>

                        <h1 class="text-red-600 dark:text-surface-0 font-bold text-3xl lg:text-5xl mb-2">Sin autorización</h1>
                        <div class="text-surface-600 dark:text-surface-200 mb-8">Por favor inicie sesión</div>

                        <a routerLink="/" class="w-full flex items-center py-8 border-surface-300 dark:border-surface-500 border-b">
                            <span class="flex justify-center items-center border-2 border-red-500 text-red-500 rounded-border" style="height: 3.5rem; width: 3.5rem">
                                <i class="pi pi-fw pi-table !text-2xl"></i>
                            </span>
                            <span class="ml-6 flex flex-col">
                                <span class="text-surface-900 dark:text-surface-0 lg:text-xl font-medium mb-0 block">Frequently Asked Questions</span>
                                <span class="text-surface-600 dark:text-surface-200 lg:text-xl">Ultricies mi quis hendrerit dolor.</span>
                            </span>
                        </a>

                        <a routerLink="/" class="w-full flex items-center py-8 border-surface-300 dark:border-surface-500 border-b">
                            <span class="flex justify-center items-center border-2 border-red-500 text-red-500 rounded-border" style="height: 3.5rem; width: 3.5rem">
                                <i class="pi pi-fw pi-question-circle !text-2xl"></i>
                            </span>
                            <span class="ml-6 flex flex-col">
                                <span class="text-surface-900 dark:text-surface-0 lg:text-xl font-medium mb-0">Solution Center</span>
                                <span class="text-surface-600 dark:text-surface-200 lg:text-xl">Phasellus faucibus scelerisque eleifend.</span>
                            </span>
                        </a>

                        <a routerLink="/" class="w-full flex items-center mb-8 py-8 border-surface-300 dark:border-surface-500 border-b">
                            <span class="flex justify-center items-center border-2 border-red-500 text-red-500 rounded-border" style="height: 3.5rem; width: 3.5rem">
                                <i class="pi pi-fw pi-unlock !text-2xl"></i>
                            </span>
                            <span class="ml-6 flex flex-col">
                                <span class="text-surface-900 dark:text-surface-0 lg:text-xl font-medium mb-0">Permission Manager</span>
                                <span class="text-surface-600 dark:text-surface-200 lg:text-xl">Accumsan in nisl nisi scelerisque</span>
                            </span>
                        </a>

                        <p-button label="Ir al Login" [routerLink]="[MY_ROUTES.authPages.signIn.absolute]" [icon]="FontAwesome.ARROW_RIGHT_FROM_BRACKET_SOLID" />
                    </div>
                </div>
            </div>
        </div>
    `
})
export class UnauthorizedComponent {

    protected readonly MY_ROUTES = MY_ROUTES;
    protected readonly FontAwesome = FontAwesome;
}
