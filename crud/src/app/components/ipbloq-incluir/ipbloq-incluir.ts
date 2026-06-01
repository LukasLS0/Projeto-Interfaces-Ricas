import { Component, inject, signal } from '@angular/core';
import { FormField } from '@angular/forms/signals';
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

  formError = signal<string | null>(null);

  ipBloqModel = signal<IpBloqueado>({ ...inicialIpBloq });
  ipBloqForm = createIpBloqForm(this.ipBloqModel);

  cadastrar(): void {
    if (this.ipBloqForm().valid()) {
      this.formError.set(null);
      this.ipBloqService.inserir(this.ipBloqForm().value());
      this.limparForm();
    } else {
      this.formError.set('Corrija os erros antes de cadastrar.');
    }
  }

  onVoltar(): void {
    this.limparForm();
    this.ipBloqService.voltar();
  }

  private limparForm(): void {
    this.ipBloqModel.set({ ...inicialIpBloq });
    this.ipBloqForm().reset();
    this.formError.set(null);
  }
}
