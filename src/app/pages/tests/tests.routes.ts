import { Routes } from '@angular/router';
import { ChildForm } from '@/pages/tests/child-form/child-form';
import { ParentForm } from '@/pages/tests/parent-form/parent-form';

export default [
    {
        path: 'parent-form',
        component: ParentForm
    },
    {
        path: 'child-form',
        component: ChildForm
    }
] as Routes;
