import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormField, form, pattern, required, min, minLength, schema } from '@angular/forms/signals';

// PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { InputText } from "primeng/inputtext";
import { FormsModule } from "@angular/forms";
import { DividerModule } from 'primeng/divider';


interface IpBloqueado {
  id: number;
  ip: string;
  tentativas: number;
  bloqueado: boolean;
  origem: string;
}

@Component({
  selector: 'app-root',
  imports: [FormField, CommonModule, TableModule, ButtonModule, ToastModule, FormsModule, DividerModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly inicialIpBloq: IpBloqueado = {
    id: 0,
    ip: '',
    tentativas: 0,
    bloqueado: false,
    origem: '',
  };

  ipBloqModel = signal<IpBloqueado>({...this.inicialIpBloq });

  ipBloqForm = form(this.ipBloqModel, (schemaPath) => {
    required(schemaPath.ip, { message: 'IP é obrigatório.' });
    pattern(
      schemaPath.ip,
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
      { message: 'IP deve ser um endereço IPv4 válido.' },
    );
    required(schemaPath.tentativas, { message: 'Tentativas é obrigatório.' });
    min(schemaPath.tentativas, 1, { message: 'Tentativas deve ser maior que zero.' });
    required(schemaPath.origem, { message: 'Origem é obrigatório.' });
    minLength(schemaPath.origem, 3, { message: 'Origem deve ter pelo menos 3 caracteres.' });
  });

  ipBloqList = signal<IpBloqueado[]>([
    { id: 1, ip: '192.168.0.14', tentativas: 24, bloqueado: true, origem: 'Firewall' },
    { id: 2, ip: '10.0.1.53', tentativas: 11, bloqueado: true, origem: 'IDS' },
    { id: 3, ip: '172.16.4.8', tentativas: 6, bloqueado: false, origem: 'Login web' },
  ]);

  editingId = signal<number | null>(null);

  // Signals derivados com computed()
  totalIps = computed(() => this.ipBloqList().length);
  ipsBloqueados = computed(() => this.ipBloqList().filter((ip) => ip.bloqueado).length);
  ipsAlerta = computed(() => this.ipBloqList().filter((ip) => ip.tentativas > 10).length);

  editando = computed(() => this.editingId() !== null);
  formError = signal<string | null>(null);
  limpar() {
    this.ipBloqModel.set({...this.inicialIpBloq});
    this.ipBloqForm().reset();
    this.editingId.set(null);
  }

  salvar() {
    if (this.ipBloqForm().valid()) {
      this.formError.set(null)
      const novoIp = this.ipBloqForm().value();

      if (this.editingId() !== null) {
        // Atualizar IP existente
        this.ipBloqList.update((list) =>
          list.map((ip) => (ip.id === this.editingId() ? { ...novoIp, id: ip.id } : ip)),
        );
        this.editingId.set(null);
      } else {
        // Adicionar novo IP
        const newId =
          this.ipBloqList().length > 0 ? Math.max(...this.ipBloqList().map((ip) => ip.id)) + 1 : 1;
        this.ipBloqList.update((list) => [...list, { ...novoIp, id: newId }]);
      }
      this.limpar();
    } else {
      this.formError.set('Corrija os erros antes de salvar.')
    }
  }

  editar(ip: IpBloqueado) {
    this.editingId.set(ip.id);
    this.ipBloqModel.set(ip);
  }

  deletar(id: number) {
    this.ipBloqList.update((list) => list.filter((ip) => ip.id !== id));
    if (this.editingId() === id) {
      this.limpar();
    }
  }
}
