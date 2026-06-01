import { Component, effect, inject, signal } from '@angular/core';
import { FormField } from '@angular/forms/signals';
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

  formError = signal<string | null>(null);

  ipBloqModel = signal<IpBloqueado>({ ...inicialIpBloq });
  ipBloqForm = createIpBloqForm(this.ipBloqModel);

  constructor() {
    effect(() => {
      const reg = this.ipBloqService.selected();
      if (reg) {
        this.ipBloqModel.set({ ...reg });
      }
    });
  }

  onSalvar(): void {
    const registro = this.ipBloqService.selected();
    if (!registro) {
      return;
    }

    if (this.ipBloqForm().valid()) {
      this.formError.set(null);
      const value = this.ipBloqForm().value();
      this.ipBloqService.atualizar({ ...value, id: registro.id });
    } else {
      this.formError.set('Corrija os erros antes de salvar.');
    }
  }

  onVoltar(): void {
    this.ipBloqService.voltar();
  }
}
