import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

interface LoginResponse {
  token: string;
  usuario: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api';
  private readonly tokenKey = 'auth_token';
  private readonly usuarioKey = 'auth_usuario';

  // Signal reativo que reflete o estado de autenticação atual.
  readonly autenticado = signal<boolean>(this.possuiToken());
  readonly usuarioLogado = signal<string | null>(this.lerUsuario());

  login(usuario: string, senha: string): Observable<void> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, { usuario, senha })
      .pipe(
        map((resposta) => {
          this.salvarSessao(resposta.token, resposta.usuario);
        }),
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.usuarioKey);
    this.autenticado.set(false);
    this.usuarioLogado.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return this.possuiToken();
  }

  private salvarSessao(token: string, usuario: string): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.usuarioKey, usuario);
    this.autenticado.set(true);
    this.usuarioLogado.set(usuario);
  }

  private possuiToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  private lerUsuario(): string | null {
    return localStorage.getItem(this.usuarioKey);
  }
}
