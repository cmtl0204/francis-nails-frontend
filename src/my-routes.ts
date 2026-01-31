export const MY_ROUTES = {
    main: 'main',
    home: '',
    layout: {
        base: 'layout'
    },
    errorPages: {
        base: 'errors',
        unauthorized: {
            absolute: '/errors/401',
            base: '401'
        },
        forbidden: {
            absolute: '/errors/403',
            base: '403'
        },
        notFound: {
            absolute: '/errors/404',
            base: '404'
        },
        unavailable: {
            absolute: '/errors/503',
            base: '503'
        }
    },
    corePages: {
        base: 'core',
        absolute: '/main/core',
        owner: {
            base: 'owner',
            absolute: '/main/core/owner',
            dashboard: {
                base: 'dashboard',
                absolute: '/main/core/owner/dashboard'
            },
            appointments: {
                base: 'appointments',
                absolute: '/main/core/owner/appointments'
            }
        },
        shared: {
            base: 'shared',
            absolute: '/main/core/shared',
            simulator: {
                base: 'simulators',
                absolute: '/main/core/shared/simulators'
            }
        }
    },
    publicPages: {
        base: 'public',
        absolute: '/public',
        emailVerification: {
            base: 'email-verifications',
            absolute: '/public/email-verifications'
        },
        appointments: {
            base: 'appointments',
            absolute: '/public/appointments'
        }
    },
    authPages: {
        base: 'auth',
        dashboard: {
            base: 'dashboard',
            absolute: '/auth/dashboard'
        },
        signIn: {
            base: 'sign-in',
            absolute: '/auth/sign-in'
        },
        signUp: {
            base: 'sign-up',
            absolute: '/auth/sign-up'
        },
        passwordReset: {
            base: 'password-reset',
            absolute: '/auth/password-reset'
        },
        passwordChanged: {
            base: 'password-changed',
            absolute: '/auth/password-changed'
        },
        securityQuestions: {
            base: 'security-questions',
            absolute: '/auth/security-questions'
        }
    },
    adminPages: {
        base: 'admin',
        user: {
            base: 'users',
            absolute: '/main/admin/users',
            form: {
                base: 'users/form',
                absolute: '/main/admin/users/form'
            },
            profile: {
                base: 'users/profile',
                absolute: '/main/admin/users/profile'
            }
        }
    },
    guessPages: {
        base: 'guess',
        simulator: {
            base: 'simulators',
            absolute: '/guess/simulators'
        }
    },
    dashboards: {
        base: 'dashboards',
        absolute: '/main/dashboards'
    }
};
