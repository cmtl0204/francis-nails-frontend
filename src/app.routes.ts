import { Routes } from '@angular/router';
import { MY_ROUTES } from '@routes';
import { AppLayoutMain } from '@layout/component/app.layout-main';
import { AppLayoutBlank } from '@layout/component/app.layout-blank';
import { AppLayoutAuth } from '@layout/component/app.layout-auth';
import { tokenGuard } from '@/guards/token.guard';
import { RegulationSimulatorComponent } from '@/pages/core/shared/components/regulation-simulator/regulation-simulator.component';

export const appRoutes: Routes = [
    {
        path: MY_ROUTES.main,
        component: AppLayoutMain,
        canActivate: [tokenGuard],
        children: [
            { path: MY_ROUTES.dashboards.base, loadChildren: () => import('./app/pages/dashboards/dashboard.routes') },
            { path: MY_ROUTES.corePages.base, loadChildren: () => import('./app/pages/core/core.routes') }
        ]
    },

    {
        path: MY_ROUTES.errorPages.base,
        component: AppLayoutBlank,
        children: [{ path: '', loadChildren: () => import('./app/layout/errors/errors.routes') }]
    },

    {
        path: MY_ROUTES.authPages.base,
        component: AppLayoutAuth,
        children: [{ path: '', loadChildren: () => import('./app/pages/auth/auth.routes') }]
    },

    {
        path: MY_ROUTES.guessPages.base,
        component: AppLayoutBlank,
        children: [{ path: MY_ROUTES.guessPages.simulator.base, component: RegulationSimulatorComponent }]
    },

    {
        path: MY_ROUTES.publicPages.base,
        component: AppLayoutBlank,
        children: [{ path: '', loadChildren: () => import('./app/pages/public/public.routes') }]
    },

    { path: '', redirectTo: '/main/dashboards', pathMatch: 'full' },

    { path: '**', redirectTo: MY_ROUTES.errorPages.notFound.absolute }
];
