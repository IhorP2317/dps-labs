import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Button} from "primeng/button";

@Component({
  selector: 'app-root',
  standalone: true,
    imports: [RouterOutlet, Button],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  title = 'dps-labs';
    ngOnInit(): void {
        console.log(Number.MAX_SAFE_INTEGER);
    }
}
