import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "/pseudorandom-numbers",
        pathMatch: "full",
    },
    {
        path: "pseudorandom-numbers",
        loadComponent: () =>
            import(
                "./pages/pseudo-random-number-generator/pseudo-random-number-generator.component"
                ).then((mod) => mod.PseudoRandomNumberGeneratorComponent),
    },
    { path: "**", redirectTo: "" },
];
