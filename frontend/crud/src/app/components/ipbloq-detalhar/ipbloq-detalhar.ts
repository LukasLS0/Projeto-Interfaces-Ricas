import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, switchMap } from 'rxjs';
import type { IpBloqueado } from '../../models/ip-bloqueado';
import { IpBloqueadoService } from '../../services/ip-bloqueado.service';

@Component({
  selector: 'app-ipbloq-detalhar',
  imports: [],
  templateUrl: './ipbloq-detalhar.html',
  styleUrl: './ipbloq-detalhar.css',
})
export class IpbloqDetalhar {
  private readonly ipBloqService = inject(IpBloqueadoService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly registro = toSignal(
    this.route.paramMap.pipe(
      switchMap((params) => {
        const id = Number(params.get('id'));
        return this.ipBloqService.buscarPorId(id);
      }),
      catchError(() => {
        void this.router.navigate(['/listar']);
        return of(null);
      }),
    ),
    { initialValue: null as IpBloqueado | null },
  );

  onVoltar(): void {
    void this.router.navigate(['/listar']);
  }
}
