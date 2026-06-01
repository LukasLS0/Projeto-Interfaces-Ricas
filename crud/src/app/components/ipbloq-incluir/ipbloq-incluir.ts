import { Component, output, signal } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { inicialIpBloq, type IpBloqueado } from '../../models/ip-bloqueado';
import { createIpBloqForm } from '../../models/ip-bloqueado-form';

@Component({
  selector: 'app-ipbloq-incluir',
  imports: [FormField],
  templateUrl: './ipbloq-incluir.html',
  styleUrl: './ipbloq-incluir.css',
})
export class IpbloqIncluir {
  salvar = output<IpBloqueado>();
  voltar = output<void>();

  formError = signal<string | null>(null);

  ipBloqModel = signal<IpBloqueado>({ ...inicialIpBloq });
  ipBloqForm = createIpBloqForm(this.ipBloqModel);

  cadastrar() {
    if (this.ipBloqForm().valid()) {
      this.formError.set(null);
      this.salvar.emit(this.ipBloqForm().value());
      this.limparForm();
    } else {
      this.formError.set('Corrija os erros antes de cadastrar.');
    }
  }

  onVoltar() {
    this.limparForm();
    this.voltar.emit();
  }

  private limparForm() {
    this.ipBloqModel.set({ ...inicialIpBloq });
    this.ipBloqForm().reset();
    this.formError.set(null);
  }
}
