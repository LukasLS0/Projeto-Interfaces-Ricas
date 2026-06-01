import { Component, effect, input, output, signal } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { inicialIpBloq, type IpBloqueado } from '../../models/ip-bloqueado';
import { createIpBloqForm } from '../../models/ip-bloqueado-form';

@Component({
  selector: 'app-ipbloq-alterar',
  imports: [FormField],
  templateUrl: './ipbloq-alterar.html',
  styleUrl: './ipbloq-alterar.css',
})
export class IpbloqAlterar {
  registro = input.required<IpBloqueado>();

  salvar = output<IpBloqueado>();
  voltar = output<void>();

  formError = signal<string | null>(null);

  ipBloqModel = signal<IpBloqueado>({ ...inicialIpBloq });
  ipBloqForm = createIpBloqForm(this.ipBloqModel);

  constructor() {
    effect(() => {
      const reg = this.registro();
      this.ipBloqModel.set({ ...reg });
    });
  }

  onSalvar() {
    if (this.ipBloqForm().valid()) {
      this.formError.set(null);
      const value = this.ipBloqForm().value();
      this.salvar.emit({ ...value, id: this.registro().id });
    } else {
      this.formError.set('Corrija os erros antes de salvar.');
    }
  }

  onVoltar() {
    this.voltar.emit();
  }
}
