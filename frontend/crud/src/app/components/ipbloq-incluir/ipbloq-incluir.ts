import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormField } from '@angular/forms/signals';
import { tap } from 'rxjs';
import { inicialIpBloq, type IpBloqueado } from '../../models/ip-bloqueado';
import { createIpBloqForm } from '../../models/ip-bloqueado-form';
import { IpBloqueadoService } from '../../services/ip-bloqueado.service';

@Component({
  selector: 'app-ipbloq-incluir',
  imports: [FormField],
  templateUrl: './ipbloq-incluir.html',
  styleUrl: './ipbloq-incluir.css',
})
export class IpbloqIncluir {
  private readonly ipBloqService = inject(IpBloqueadoService);
  private readonly router = inject(Router);

  formError = signal<string | null>(null);

  ipBloqModel = signal<IpBloqueado>({ ...inicialIpBloq });
  ipBloqForm = createIpBloqForm(this.ipBloqModel);

  cadastrar(): void {
    if (this.ipBloqForm().valid()) {
      this.formError.set(null);
      this.ipBloqService
        .inserir(this.ipBloqForm().value())
        .pipe(
          tap(() => {
            this.limparForm();
            void this.router.navigate(['/listar']);
          }),
        )
        .subscribe({
          error: () => this.formError.set('Erro ao cadastrar. Tente novamente.'),
        });
    } else {
      this.formError.set('Corrija os erros antes de cadastrar.');
    }
  }

  onVoltar(): void {
    this.limparForm();
    void this.router.navigate(['/listar']);
  }

  private limparForm(): void {
    this.ipBloqModel.set({ ...inicialIpBloq });
    this.ipBloqForm().reset();
    this.formError.set(null);
  }
}
