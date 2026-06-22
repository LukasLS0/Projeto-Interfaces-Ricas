import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { form, FormField, required, minLength } from '@angular/forms/signals';
import { AuthService } from '../../services/auth.service';

interface Credenciais {
  usuario: string;
  senha: string;
}

@Component({
  selector: 'app-login',
  imports: [FormField, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly carregando = signal(false);
  protected readonly erro = signal<string | null>(null);

  protected readonly credenciais = signal<Credenciais>({ usuario: '', senha: '' });
  protected readonly loginForm = form(this.credenciais, (path) => {
    required(path.usuario, { message: 'Informe o usuário.' });
    required(path.senha, { message: 'Informe a senha.' });
    minLength(path.senha, 4, { message: 'A senha deve ter pelo menos 4 caracteres.' });
  });

  entrar(): void {
    if (!this.loginForm().valid()) {
      this.erro.set('Preencha usuário e senha corretamente.');
      return;
    }

    const { usuario, senha } = this.loginForm().value();
    this.carregando.set(true);
    this.erro.set(null);

    this.authService.login(usuario, senha).subscribe({
      next: () => {
        this.carregando.set(false);
        void this.router.navigate(['/listar']);
      },
      error: () => {
        this.carregando.set(false);
        this.erro.set('Usuário ou senha inválidos.');
      },
    });
  }
}
