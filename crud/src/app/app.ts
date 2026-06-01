import { Component, inject } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { IpbloqAlterar } from './components/ipbloq-alterar/ipbloq-alterar';
import { IpbloqDetalhar } from './components/ipbloq-detalhar/ipbloq-detalhar';
import { IpbloqIncluir } from './components/ipbloq-incluir/ipbloq-incluir';
import { IpbloqListar } from './components/ipbloq-listar/ipbloq-listar';
import { IpBloqueadoService } from './services/ip-bloqueado.service';

@Component({
  selector: 'app-root',
  imports: [DividerModule, IpbloqListar, IpbloqIncluir, IpbloqDetalhar, IpbloqAlterar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly ipBloqService = inject(IpBloqueadoService);
}
