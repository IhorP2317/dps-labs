import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [DividerModule, RouterLink],
    templateUrl: './app-header.component.html',
    styleUrl: './app-header.component.scss',
})
export class AppHeaderComponent {
    navLinks = [
        {
            path: '/pseudorandom-numbers',
            label: 'PSEUDORANDOM NUMBERS',
        },
        {
            path: '/md5',
            label: 'MD5',
        },
        {
            path: '/rc5',
            label: 'RC5',
        },
    ];
}
