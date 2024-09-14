import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Button } from 'primeng/button';
import { SpinnerModule } from 'primeng/spinner';
import { AsyncPipe, NgIf } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        Button,
        SpinnerModule,
        AsyncPipe,
        NgIf,
        ProgressSpinnerModule,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    title = 'dps-labs';
}
