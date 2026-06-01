import { Injectable, computed, signal } from '@angular/core';
import type { IpBloqueado } from '../models/ip-bloqueado';

const DADOS_INICIAIS: IpBloqueado[] = [
  { id: 1, ip: '192.168.0.14', tentativas: 24, bloqueado: true, origem: 'Firewall' },
  { id: 2, ip: '10.0.1.53', tentativas: 11, bloqueado: true, origem: 'IDS' },
  { id: 3, ip: '172.16.4.8', tentativas: 6, bloqueado: false, origem: 'Login web' },
];

@Injectable({ providedIn: 'root' })
export class IpBloqueadoService {
  private readonly registros = signal<IpBloqueado[]>(DADOS_INICIAIS);

  readonly totalIps = computed(() => this.registros().length);
  readonly ipsBloqueados = computed(() => this.registros().filter((ip) => ip.bloqueado).length);
  readonly ipsAlerta = computed(() => this.registros().filter((ip) => ip.tentativas > 10).length);

  listar(): IpBloqueado[] {
    return this.registros();
  }

  buscarPorId(id: number): IpBloqueado | undefined {
    return this.registros().find((ip) => ip.id === id);
  }

  inserir(dto: IpBloqueado): void {
    const newId =
      this.registros().length > 0 ? Math.max(...this.registros().map((ip) => ip.id)) + 1 : 1;
    this.registros.update((list) => [...list, { ...dto, id: newId }]);
  }

  atualizar(dto: IpBloqueado): void {
    this.registros.update((list) => list.map((ip) => (ip.id === dto.id ? dto : ip)));
  }

  remover(id: number): void {
    this.registros.update((list) => list.filter((ip) => ip.id !== id));
  }
}
