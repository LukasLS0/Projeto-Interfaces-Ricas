import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { form, FormField, required, minLength } from '@angular/forms/signals';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';

interface DadosCadastro {
  usuario: string;
  senha: string;
  confirmarSenha: string;
}

@Component({
  selector: 'app-usuario-cadastrar',
  imports: [FormField, RouterLink],
  templateUrl: './usuario-cadastrar.html',
  styleUrl: './usuario-cadastrar.css',
})
export class UsuarioCadastrar {
  private readonly usuarioService = inject(UsuarioService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly carregando = signal(false);
  protected readonly erro = signal<string | null>(null);

  protected readonly dadosCadastro = signal<DadosCadastro>({
    usuario: '',
    senha: '',
    confirmarSenha: '',
  });

  protected readonly cadastroForm = form(this.dadosCadastro, (path) => {
    required(path.usuario, { message: 'Informe o usuário.' });
    required(path.senha, { message: 'Informe a senha.' });
    minLength(path.senha, 4, { message: 'A senha deve ter pelo menos 4 caracteres.' });
    required(path.confirmarSenha, { message: 'Confirme a senha.' });
  });

  cadastrar(): void {
    if (!this.cadastroForm().valid()) {
      this.erro.set('Preencha todos os campos corretamente.');
      return;
    }

    const { usuario, senha, confirmarSenha } = this.cadastroForm().value();

    if (senha !== confirmarSenha) {
      this.erro.set('As senhas não conferem.');
      return;
    }

    this.carregando.set(true);
    this.erro.set(null);

    this.usuarioService.cadastrar(usuario, senha).subscribe({
      next: (resposta) => {
        this.carregando.set(false);
        this.authService.estabelecerSessao(resposta.token, resposta.usuario);
        void this.router.navigate(['/listar']);
      },
      error: (erro: HttpErrorResponse) => {
        this.carregando.set(false);
        this.erro.set(this.mensagemErro(erro));
      },
    });
  }

  private mensagemErro(erro: HttpErrorResponse): string {
    if (erro.status === 409) {
      return 'Usuário já cadastrado.';
    }
    if (erro.error?.message) {
      return erro.error.message;
    }
    return 'Erro ao cadastrar. Tente novamente.';
  }
}
