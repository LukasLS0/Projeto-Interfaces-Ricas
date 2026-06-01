import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import type { IpBloqueado } from '../../models/ip-bloqueado';
import { IpBloqueadoService } from '../../services/ip-bloqueado.service';

@Component({
  selector: 'app-ipbloq-listar',
  imports: [CommonModule, TableModule, ButtonModule],
  templateUrl: './ipbloq-listar.html',
  styleUrl: './ipbloq-listar.css',
})
export class IpbloqListar {
  protected readonly ipBloqService = inject(IpBloqueadoService);
  private readonly router = inject(Router);

  onIncluir(): void {
    void this.router.navigate(['/incluir']);
  }

  onDetalhar(registro: IpBloqueado): void {
    void this.router.navigate(['/detalhe', registro.id]);
  }

  onAlterar(registro: IpBloqueado): void {
    void this.router.navigate(['/alterar', registro.id]);
  }

  onRemover(id: number): void {
    this.ipBloqService.remover(id);
  }
}
