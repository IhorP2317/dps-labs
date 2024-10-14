import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/pseudorandom-numbers',
        pathMatch: 'full',
    },
    {
        path: 'pseudorandom-numbers',
        loadComponent: () =>
            import(
                './pages/pseudo-random-number-generator/pseudo-random-number-generator.component'
            ).then((mod) => mod.PseudoRandomNumberGeneratorComponent),
    },
    {
        path: 'md5',
        loadComponent: () =>
            import('./pages/md5-generator/md5-generator.component').then(
                (mod) => mod.Md5GeneratorComponent,
            ),
    },
    {
        path: 'rc5',
        loadComponent: () =>
            import('./pages/rc5-coder/rc5-coder.component').then(
                (mod) => mod.Rc5CoderComponent,
            ),
    },
    { path: '**', redirectTo: '' },
];
