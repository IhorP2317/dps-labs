import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoadingService } from '../../services/loading.service';

@Component({
    selector: 'app-loader',
    standalone: true,
    imports: [AsyncPipe, ProgressSpinnerModule],
    templateUrl: './app-loader.component.html',
    styleUrl: './app-loader.component.scss',
})
export class AppLoaderComponent {
    public loader$ = this.loaderService.loading$;
    constructor(private loaderService: LoadingService) {}
}
