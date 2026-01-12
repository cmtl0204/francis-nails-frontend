import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-admin-dashboard',
    imports: [ReactiveFormsModule, TableModule],
    templateUrl: './admin-dashboard.component.html',
    styleUrl: './admin-dashboard.component.scss'
})
export default class AdminDashboardComponent {}
