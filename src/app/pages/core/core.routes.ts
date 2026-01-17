import { Routes } from '@angular/router';
import { MY_ROUTES } from '@routes';

export default [
    {
        path: MY_ROUTES.corePages.shared.base,
        loadChildren: () => import('@modules/core/shared/shared.routes')
    },
    {
        path: MY_ROUTES.corePages.owner.base,
        loadChildren: () => import('@modules/core/roles/owner/owner.routes'),
    }
] as Routes;
