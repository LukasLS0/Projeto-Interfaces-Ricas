import { Routes } from '@angular/router';
import { IpbloqAlterar } from './components/ipbloq-alterar/ipbloq-alterar';
import { IpbloqDetalhar } from './components/ipbloq-detalhar/ipbloq-detalhar';
import { IpbloqIncluir } from './components/ipbloq-incluir/ipbloq-incluir';
import { IpbloqListar } from './components/ipbloq-listar/ipbloq-listar';

export const routes: Routes = [
  { path: '', redirectTo: 'listar', pathMatch: 'full' },
  { path: 'listar', component: IpbloqListar },
  { path: 'incluir', component: IpbloqIncluir },
  { path: 'detalhe/:id', component: IpbloqDetalhar },
  { path: 'alterar/:id', component: IpbloqAlterar },
  { path: '**', redirectTo: 'listar' },
];
