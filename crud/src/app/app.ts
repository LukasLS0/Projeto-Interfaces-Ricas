import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

interface IpBloqueado {
  id: number;
  ip: string;
  tentativas: number;
  bloqueado: boolean;
  origem: string;
}

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    CheckboxModule,
    InputNumberModule,
    InputTextModule,
    TableModule,
    TagModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly title = 'Painel de IPs Bloqueados';

  protected readonly ips = signal<IpBloqueado[]>([
    { id: 1, ip: '192.168.0.14', tentativas: 24, bloqueado: true, origem: 'Firewall' },
    { id: 2, ip: '10.0.1.53', tentativas: 11, bloqueado: true, origem: 'IDS' },
    { id: 3, ip: '172.16.4.8', tentativas: 6, bloqueado: false, origem: 'Login web' },
  ]);

  protected readonly editingId = signal<number | null>(null);

  protected readonly totalIps = computed(() => this.ips().length);
  protected readonly ipsBloqueados = computed(
    () => this.ips().filter((item) => item.bloqueado).length,
  );
  protected readonly ipsAlerta = computed(
    () => this.ips().filter((item) => item.tentativas >= 10).length,
  );

  protected readonly form = this.fb.group({
    ip: ['', [Validators.required, Validators.minLength(7)]],
    tentativas: [0, [Validators.required, Validators.min(1)]],
    bloqueado: [true],
    origem: ['', [Validators.required, Validators.minLength(3)]],
  });

  protected limpar(): void {
    this.editingId.set(null);
    this.form.reset({ ip: '', tentativas: 0, bloqueado: true, origem: '' });
  }

  protected editar(item: IpBloqueado): void {
    this.editingId.set(item.id);
    this.form.setValue({
      ip: item.ip,
      tentativas: item.tentativas,
      bloqueado: item.bloqueado,
      origem: item.origem,
    });
  }

  protected salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dados = this.form.getRawValue();
    const ipLimpo = dados.ip.trim();
    const origemLimpa = dados.origem.trim();
    const editingId = this.editingId();

    if (editingId === null) {
      // Novo IP
      const novoItem: IpBloqueado = {
        id: Math.max(...this.ips().map((i) => i.id), 0) + 1,
        ip: ipLimpo,
        tentativas: dados.tentativas,
        bloqueado: dados.bloqueado,
        origem: origemLimpa,
      };
      this.ips.update((lista) => [...lista, novoItem]);
    } else {
      // Editar IP
      this.ips.update((lista) =>
        lista.map((item) =>
          item.id === editingId
            ? {
                ...item,
                ip: ipLimpo,
                tentativas: dados.tentativas,
                bloqueado: dados.bloqueado,
                origem: origemLimpa,
              }
            : item,
        ),
      );
    }

    this.limpar();
  }

  protected remover(item: IpBloqueado): void {
    if (!confirm(`Remover o IP ${item.ip}?`)) return;

    this.ips.update((lista) => lista.filter((ip) => ip.id !== item.id));

    if (this.editingId() === item.id) {
      this.limpar();
    }
  }

  protected status(bloqueado: boolean): { text: string; severity: 'danger' | 'warn' } {
    return bloqueado
      ? { text: 'Bloqueado', severity: 'danger' }
      : { text: 'Monitorado', severity: 'warn' };
  }
}


