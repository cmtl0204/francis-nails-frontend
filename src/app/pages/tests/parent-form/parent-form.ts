import { Component } from '@angular/core';
import { ChildrenListFormComponent } from '@/pages/tests/children-list-form/children-list-form.component';

@Component({
    selector: 'app-parent-form',
    imports: [ChildrenListFormComponent],
    templateUrl: './parent-form.html',
    styleUrl: './parent-form.scss'
})
export class ParentForm {}
