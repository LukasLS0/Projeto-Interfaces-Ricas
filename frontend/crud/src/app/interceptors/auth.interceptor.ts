import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

// Interceptor que anexa o token JWT no header Authorization de toda
// requisição HTTP (GET, PUT, POST, DELETE) enviada ao backend.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  const requisicao = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(requisicao).pipe(
    catchError((erro: HttpErrorResponse) => {
      // Sessão inválida/expirada: limpa o estado e volta para o login.
      if (erro.status === 401) {
        authService.logout();
        void router.navigate(['/login']);
      }
      return throwError(() => erro);
    }),
  );
};
