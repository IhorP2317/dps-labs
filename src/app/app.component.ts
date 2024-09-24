import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Button } from 'primeng/button';
import { SpinnerModule } from 'primeng/spinner';
import { AsyncPipe } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AppLoaderComponent } from './shared/components/app-loader/app-loader.component';
import { AppHeaderComponent } from './shared/components/app-header/app-header.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        Button,
        SpinnerModule,
        AsyncPipe,
        ProgressSpinnerModule,
        AppLoaderComponent,
        AppHeaderComponent,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    title = 'dps-labs';
}
