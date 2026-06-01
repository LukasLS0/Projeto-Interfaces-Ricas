import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormField } from '@angular/forms/signals';
import { ipBloqueadoDoEstadoDaNavegacao } from '../../models/ip-bloqueado-nav';
import { inicialIpBloq, type IpBloqueado } from '../../models/ip-bloqueado';
import { createIpBloqForm } from '../../models/ip-bloqueado-form';
import { IpBloqueadoService } from '../../services/ip-bloqueado.service';

@Component({
  selector: 'app-ipbloq-alterar',
  imports: [FormField],
  templateUrl: './ipbloq-alterar.html',
  styleUrl: './ipbloq-alterar.css',
})
export class IpbloqAlterar implements OnInit {
  private readonly ipBloqService = inject(IpBloqueadoService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly registroSelecionado = signal<IpBloqueado | null>(null);

  formError = signal<string | null>(null);

  ipBloqModel = signal<IpBloqueado>({ ...inicialIpBloq });
  ipBloqForm = createIpBloqForm(this.ipBloqModel);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const registro = ipBloqueadoDoEstadoDaNavegacao() ?? this.ipBloqService.buscarPorId(id);

    if (!registro) {
      void this.router.navigate(['/listar']);
      return;
    }

    this.registroSelecionado.set(registro);
    this.ipBloqModel.set({ ...registro });
  }

  onSalvar(): void {
    const registro = this.registroSelecionado();
    if (!registro) {
      return;
    }

    if (this.ipBloqForm().valid()) {
      this.formError.set(null);
      const value = this.ipBloqForm().value();
      this.ipBloqService.atualizar({ ...value, id: registro.id });
      void this.router.navigate(['/listar']);
    } else {
      this.formError.set('Corrija os erros antes de salvar.');
    }
  }

  onVoltar(): void {
    void this.router.navigate(['/listar']);
  }
}
