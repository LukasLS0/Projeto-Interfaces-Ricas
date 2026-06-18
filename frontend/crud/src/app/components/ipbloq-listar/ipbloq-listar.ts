import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { switchMap } from 'rxjs';
import type { IpBloqueado } from '../../models/ip-bloqueado';
import { IpBloqueadoService } from '../../services/ip-bloqueado.service';

@Component({
  selector: 'app-ipbloq-listar',
  imports: [CommonModule, TableModule, ButtonModule],
  templateUrl: './ipbloq-listar.html',
  styleUrl: './ipbloq-listar.css',
})
export class IpbloqListar {
  private readonly ipBloqService = inject(IpBloqueadoService);
  private readonly router = inject(Router);

  private readonly recarregar = signal(0);

  protected readonly registros = toSignal(
    toObservable(this.recarregar).pipe(switchMap(() => this.ipBloqService.listar())),
    { initialValue: [] as IpBloqueado[] },
  );

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
    this.ipBloqService.remover(id).subscribe({
      next: () => this.recarregar.update((contador) => contador + 1),
    });
  }
}
