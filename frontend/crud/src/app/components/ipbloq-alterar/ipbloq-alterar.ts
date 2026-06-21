import { Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { FormField } from '@angular/forms/signals';
import { catchError, of, switchMap, tap } from 'rxjs';
import { inicialIpBloq, type IpBloqueado } from '../../models/ip-bloqueado';
import { createIpBloqForm } from '../../models/ip-bloqueado-form';
import { IpBloqueadoService } from '../../services/ip-bloqueado.service';

@Component({
  selector: 'app-ipbloq-alterar',
  imports: [FormField],
  templateUrl: './ipbloq-alterar.html',
  styleUrl: './ipbloq-alterar.css',
})
export class IpbloqAlterar {
  private readonly ipBloqService = inject(IpBloqueadoService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly registroCarregado = toSignal(
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

  formError = signal<string | null>(null);

  ipBloqModel = signal<IpBloqueado>({ ...inicialIpBloq });
  ipBloqForm = createIpBloqForm(this.ipBloqModel);

  constructor() {
    effect(() => {
      const registro = this.registroCarregado();
      if (registro) {
        this.ipBloqModel.set({ ...registro });
      }
    });
  }

  onSalvar(): void {
    const registro = this.registroCarregado();
    if (!registro) {
      return;
    }

    if (this.ipBloqForm().valid()) {
      this.formError.set(null);
      const value = this.ipBloqForm().value();
      this.ipBloqService
        .atualizar({ ...value, id: registro.id })
        .pipe(tap(() => void this.router.navigate(['/listar'])))
        .subscribe({
          error: () => this.formError.set('Erro ao salvar. Tente novamente.'),
        });
    } else {
      this.formError.set('Corrija os erros antes de salvar.');
    }
  }

  onVoltar(): void {
    void this.router.navigate(['/listar']);
  }
}
