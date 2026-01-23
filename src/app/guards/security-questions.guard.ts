import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@/pages/auth/auth.service';

export const securityQuestionsGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    const securityDate = authService.auth?.securityQuestionAcceptedAt;

    if (securityDate) {
        return true;
    }

    return router.createUrlTree(['/security-questions']);
};
