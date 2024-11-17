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
        path: 'file-coder',
        loadComponent: () =>
            import('./pages/file-coder/file-coder.component').then(
                (mod) => mod.FileCoderComponent,
            ),
    },
    {
        path: 'dsa-signature',
        loadComponent: () =>
            import('./pages/dsa-signature/dsa-signature.component').then(
                (mod) => mod.DsaSignatureComponent,
            ),
    },
    { path: '**', redirectTo: '' },
];
