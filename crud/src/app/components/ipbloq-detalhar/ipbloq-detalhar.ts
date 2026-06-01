import { Component, inject } from '@angular/core';
import { IpBloqueadoService } from '../../services/ip-bloqueado.service';

@Component({
  selector: 'app-ipbloq-detalhar',
  imports: [],
  templateUrl: './ipbloq-detalhar.html',
  styleUrl: './ipbloq-detalhar.css',
})
export class IpbloqDetalhar {
  protected readonly ipBloqService = inject(IpBloqueadoService);

  onVoltar(): void {
    this.ipBloqService.voltar();
  }
}
