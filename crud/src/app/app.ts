import { Component, computed, signal } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { IpbloqAlterar } from './components/ipbloq-alterar/ipbloq-alterar';
import { IpbloqDetalhar } from './components/ipbloq-detalhar/ipbloq-detalhar';
import { IpbloqIncluir } from './components/ipbloq-incluir/ipbloq-incluir';
import { IpbloqListar } from './components/ipbloq-listar/ipbloq-listar';
import type { IpBloqueado, ViewMode } from './models/ip-bloqueado';

@Component({
  selector: 'app-root',
  imports: [DividerModule, IpbloqListar, IpbloqIncluir, IpbloqDetalhar, IpbloqAlterar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  ipBloqList = signal<IpBloqueado[]>([
    { id: 1, ip: '192.168.0.14', tentativas: 24, bloqueado: true, origem: 'Firewall' },
    { id: 2, ip: '10.0.1.53', tentativas: 11, bloqueado: true, origem: 'IDS' },
    { id: 3, ip: '172.16.4.8', tentativas: 6, bloqueado: false, origem: 'Login web' },
  ]);

  viewMode = signal<ViewMode>('listar');
  selectedIp = signal<IpBloqueado | null>(null);

  totalIps = computed(() => this.ipBloqList().length);
  ipsBloqueados = computed(() => this.ipBloqList().filter((ip) => ip.bloqueado).length);
  ipsAlerta = computed(() => this.ipBloqList().filter((ip) => ip.tentativas > 10).length);

  onIncluir() {
    this.viewMode.set('incluir');
  }

  onDetalhar(ip: IpBloqueado) {
    this.selectedIp.set(ip);
    this.viewMode.set('detalhar');
  }

  onAlterar(ip: IpBloqueado) {
    this.selectedIp.set(ip);
    this.viewMode.set('alterar');
  }

  onVoltar() {
    this.selectedIp.set(null);
    this.viewMode.set('listar');
  }

  onSalvarIncluir(dto: IpBloqueado) {
    const newId =
      this.ipBloqList().length > 0 ? Math.max(...this.ipBloqList().map((ip) => ip.id)) + 1 : 1;
    this.ipBloqList.update((list) => [...list, { ...dto, id: newId }]);
    this.viewMode.set('listar');
  }

  onSalvarAlterar(dto: IpBloqueado) {
    this.ipBloqList.update((list) => list.map((ip) => (ip.id === dto.id ? dto : ip)));
    this.selectedIp.set(null);
    this.viewMode.set('listar');
  }

  onDeletar(id: number) {
    this.ipBloqList.update((list) => list.filter((ip) => ip.id !== id));
    if (this.selectedIp()?.id === id) {
      this.selectedIp.set(null);
      this.viewMode.set('listar');
    }
  }
}
