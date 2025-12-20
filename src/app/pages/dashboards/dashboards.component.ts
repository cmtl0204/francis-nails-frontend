import { Component, inject } from '@angular/core';
import { AuthService } from '@modules/auth/auth.service';
import { RoleEnum } from '@utils/enums';
import { AdminDashboardComponent } from '@modules/core/admin/admin-dashboard/admin-dashboard.component';
import { BreadcrumbService } from '@layout/service';
import { DacDashboardComponent } from '@modules/core/roles/dac/dac-dashboard/dac-dashboard.component';
import { ExternalDashboardComponent } from '@modules/core/roles/external/components/external-dashboard/external-dashboard.component';
import { GadDashboardComponent } from '@modules/core/roles/gad/gad-dashboard/gad-dashboard.component';
import { TechnicianDashboardComponent } from '@modules/core/roles/technician/technician-dashboard/technician-dashboard.component';
import { SpecialistDashboardComponent } from '@modules/core/roles/specialist/specialist-dashboard/specialist-dashboard.component';
import { OwnerDashboardComponent } from '@/pages/core/roles/owner/owner-dashboard/owner-dashboard.component';

@Component({
    selector: 'app-dashboards',
    imports: [DacDashboardComponent, AdminDashboardComponent, ExternalDashboardComponent, GadDashboardComponent, TechnicianDashboardComponent, SpecialistDashboardComponent, OwnerDashboardComponent],
    templateUrl: './dashboards.component.html',
    styleUrl: './dashboards.component.scss'
})
export class DashboardsComponent {
    protected readonly authService = inject(AuthService);
    private readonly _breadcrumbService = inject(BreadcrumbService);

    protected readonly RoleEnum = RoleEnum;

    constructor() {
        this._breadcrumbService.setItems([{ label: 'Dashboard' }]);
    }
}
