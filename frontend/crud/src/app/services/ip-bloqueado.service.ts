import { Injectable, computed, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { IpBloqueado } from '../models/ip-bloqueado';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class IpBloqueadoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://congenial-chainsaw-jpwv5qww6xqh5xgw-3000.app.github.dev/api/ips';


  private readonly registros = signal<IpBloqueado[]>([]);

  readonly totalIps = computed(() => this.registros().length);
  readonly ipsBloqueados = computed(() => this.registros().filter((ip) => ip.bloqueado).length);
  readonly ipsAlerta = computed(() => this.registros().filter((ip) => ip.tentativas > 10).length);

  constructor() {
    // Carrega os dados assim que o serviço é iniciado
    this.carregarIps();
  }

  // Busca inicial do backend
  private carregarIps(): void {
    this.http.get<IpBloqueado[]>(this.apiUrl).subscribe({
      next: (dados) => this.registros.set(dados),
      error: (err) => console.error('Erro ao carregar IPs do servidor:', err)
    });
  }

  listar(): IpBloqueado[] {
    return this.registros();
  }

  buscarPorId(id: number): IpBloqueado | undefined {
    return this.registros().find((ip) => ip.id === id);
  }

  // Usando async/await com firstValueFrom para simplificar o fluxo junto com Signals
  async inserir(dto: IpBloqueado): Promise<void> {
    try {
      const novoIp = await firstValueFrom(this.http.post<IpBloqueado>(this.apiUrl, dto));
      this.registros.update((list) => [...list, novoIp]);
    } catch (err) {
      console.error('Erro ao inserir IP:', err);
    }
  }

  async atualizar(dto: IpBloqueado): Promise<void> {
    try {
      const ipAtualizado = await firstValueFrom(this.http.put<IpBloqueado>(`${this.apiUrl}/${dto.id}`, dto));
      this.registros.update((list) => list.map((ip) => (ip.id === dto.id ? ipAtualizado : ip)));
    } catch (err) {
      console.error('Erro ao atualizar IP:', err);
    }
  }

  async remover(id: number): Promise<void> {
    try {
      await firstValueFrom(this.http.delete<void>(`${`${this.apiUrl}/${id}`}`));
      this.registros.update((list) => list.filter((ip) => ip.id !== id));
    } catch (err) {
      console.error('Erro ao remover IP:', err);
    }
  }
}