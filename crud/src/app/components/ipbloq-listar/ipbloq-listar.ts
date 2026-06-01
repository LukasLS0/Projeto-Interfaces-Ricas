import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import type { IpBloqueado } from '../../models/ip-bloqueado';

@Component({
  selector: 'app-ipbloq-listar',
  imports: [CommonModule, TableModule, ButtonModule],
  templateUrl: './ipbloq-listar.html',
  styleUrl: './ipbloq-listar.css',
})
export class IpbloqListar {
  items = input.required<IpBloqueado[]>();

  incluir = output<void>();
  detalhar = output<IpBloqueado>();
  alterar = output<IpBloqueado>();
  deletar = output<number>();
}
