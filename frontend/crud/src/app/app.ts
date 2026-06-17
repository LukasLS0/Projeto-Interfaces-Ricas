import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { IpBloqueadoService } from './services/ip-bloqueado.service';

@Component({
  selector: 'app-root',
  imports: [DividerModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly ipBloqService = inject(IpBloqueadoService);
}
