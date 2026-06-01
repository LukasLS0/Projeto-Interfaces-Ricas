import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ipBloqueadoDoEstadoDaNavegacao } from '../../models/ip-bloqueado-nav';
import type { IpBloqueado } from '../../models/ip-bloqueado';
import { IpBloqueadoService } from '../../services/ip-bloqueado.service';

@Component({
  selector: 'app-ipbloq-detalhar',
  imports: [],
  templateUrl: './ipbloq-detalhar.html',
  styleUrl: './ipbloq-detalhar.css',
})
export class IpbloqDetalhar implements OnInit {
  protected readonly registro = signal<IpBloqueado | null>(null);

  private readonly ipBloqService = inject(IpBloqueadoService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const registro = ipBloqueadoDoEstadoDaNavegacao() ?? this.ipBloqService.buscarPorId(id);

    if (!registro) {
      void this.router.navigate(['/listar']);
      return;
    }

    this.registro.set(registro);
  }

  onVoltar(): void {
    void this.router.navigate(['/listar']);
  }
}
