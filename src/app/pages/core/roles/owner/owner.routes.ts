import { Routes } from '@angular/router';
import { MY_ROUTES } from '@routes';
import { TechnicianDashboardComponent } from '@modules/core/roles/technician/technician-dashboard/technician-dashboard.component';
import { ProcessComponent } from '@modules/core/roles/technician/process/process.component';
import { Appointments } from '@/pages/core/roles/owner/components/appointments/appointments';


export default [
    {
        path: MY_ROUTES.corePages.owner.dashboard.base,
        component: TechnicianDashboardComponent
    },
    {
        path: MY_ROUTES.corePages.owner.appointments.base,
        component: Appointments
    }
] as Routes;
