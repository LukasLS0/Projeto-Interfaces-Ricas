import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import type { IpBloqueado } from '../models/ip-bloqueado';

@Injectable({ providedIn: 'root' })
export class IpBloqueadoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/ips';

  listar(): Observable<IpBloqueado[]> {
    return this.http.get<IpBloqueado[]>(this.apiUrl).pipe(
      catchError((erro) => this.tratarErro(erro)),
    );
  }

  buscarPorId(id: number): Observable<IpBloqueado> {
    return this.http.get<IpBloqueado>(`${this.apiUrl}/${id}`).pipe(
      catchError((erro) => this.tratarErro(erro)),
    );
  }

  inserir(dto: IpBloqueado): Observable<IpBloqueado> {
    return this.http.post<IpBloqueado>(this.apiUrl, dto).pipe(
      catchError((erro) => this.tratarErro(erro)),
    );
  }

  atualizar(dto: IpBloqueado): Observable<IpBloqueado> {
    return this.http.put<IpBloqueado>(`${this.apiUrl}/${dto.id}`, dto).pipe(
      catchError((erro) => this.tratarErro(erro)),
    );
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((erro) => this.tratarErro(erro)),
    );
  }

  private tratarErro(erro: unknown): Observable<never> {
    console.error('Erro na API de IPs bloqueados:', erro);
    return throwError(() => erro);
  }
}
