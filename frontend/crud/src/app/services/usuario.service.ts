import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

interface CadastroResponse {
  token: string;
  usuario: string;
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/usuarios';

  cadastrar(usuario: string, senha: string): Observable<CadastroResponse> {
    return this.http.post<CadastroResponse>(this.apiUrl, { usuario, senha }).pipe(
      catchError((erro) => this.tratarErro(erro)),
    );
  }

  private tratarErro(erro: unknown): Observable<never> {
    console.error('Erro na API de usuários:', erro);
    return throwError(() => erro);
  }
}
