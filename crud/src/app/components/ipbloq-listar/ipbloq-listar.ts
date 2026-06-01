import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { IpBloqueadoService } from '../../services/ip-bloqueado.service';
import type { IpBloqueado } from '../../models/ip-bloqueado';

@Component({
  selector: 'app-ipbloq-listar',
  imports: [CommonModule, TableModule, ButtonModule],
  templateUrl: './ipbloq-listar.html',
  styleUrl: './ipbloq-listar.css',
})
export class IpbloqListar {
  protected readonly ipBloqService = inject(IpBloqueadoService);

  onIncluir(): void {
    this.ipBloqService.abrirIncluir();
  }

  onDetalhar(registro: IpBloqueado): void {
    this.ipBloqService.detalhar(registro);
  }

  onAlterar(registro: IpBloqueado): void {
    this.ipBloqService.abrirAlterar(registro);
  }

  onRemover(id: number): void {
    this.ipBloqService.remover(id);
  }
}
