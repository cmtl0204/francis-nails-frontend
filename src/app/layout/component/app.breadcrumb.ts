import { Component, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { Breadcrumb } from 'primeng/breadcrumb';
import { BreadcrumbService } from '@layout/service';

@Component({
    selector: 'app-breadcrumb',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, Breadcrumb],
    template: `
        <p-breadcrumb class="max-w-full" [model]="breadcrumbService.items()" [home]="home" />
        <br>
    `
})
export class AppBreadcrumb implements OnInit {
    protected readonly breadcrumbService = inject(BreadcrumbService);
    home!: MenuItem;

    ngOnInit() {
        this.home = { icon: 'pi pi-home', routerLink: '/' };
    }
}
