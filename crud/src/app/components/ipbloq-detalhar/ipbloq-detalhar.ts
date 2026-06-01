import { Component, input, output } from '@angular/core';
import type { IpBloqueado } from '../../models/ip-bloqueado';

@Component({
  selector: 'app-ipbloq-detalhar',
  imports: [],
  templateUrl: './ipbloq-detalhar.html',
  styleUrl: './ipbloq-detalhar.css',
})
export class IpbloqDetalhar {
  registro = input.required<IpBloqueado>();
  voltar = output<void>();
}
