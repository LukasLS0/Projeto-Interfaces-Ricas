import { Routes } from '@angular/router';
import { IpbloqAlterar } from './components/ipbloq-alterar/ipbloq-alterar';
import { IpbloqDetalhar } from './components/ipbloq-detalhar/ipbloq-detalhar';
import { IpbloqIncluir } from './components/ipbloq-incluir/ipbloq-incluir';
import { IpbloqListar } from './components/ipbloq-listar/ipbloq-listar';
import { Login } from './components/login/login';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'listar', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'listar', component: IpbloqListar, canActivate: [authGuard] },
  { path: 'incluir', component: IpbloqIncluir, canActivate: [authGuard] },
  { path: 'detalhe/:id', component: IpbloqDetalhar, canActivate: [authGuard] },
  { path: 'alterar/:id', component: IpbloqAlterar, canActivate: [authGuard] },
  { path: '**', redirectTo: 'listar' },
];
