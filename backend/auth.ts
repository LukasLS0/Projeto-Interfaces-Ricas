import crypto from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';

// Em produção, use uma variável de ambiente. Aqui mantemos um segredo fixo
// apenas para fins didáticos.
const JWT_SECRET = process.env.JWT_SECRET ?? 'segredo-super-secreto-troque-em-producao';
const TOKEN_EXPIRACAO_SEGUNDOS = 60 * 60; // 1 hora

// "Banco" de usuários em memória (mockado).
interface Usuario {
  id: number;
  usuario: string;
  senha: string;
}

const USUARIOS: Usuario[] = [
  { id: 1, usuario: 'admin', senha: 'admin123' },
];

export interface TokenPayload {
  sub: number;
  usuario: string;
  iat: number;
  exp: number;
}

// --- Helpers de codificação base64url ---
function base64UrlEncode(input: Buffer | string): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlDecode(input: string): Buffer {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(base64, 'base64');
}

function assinar(conteudo: string): string {
  return base64UrlEncode(
    crypto.createHmac('sha256', JWT_SECRET).update(conteudo).digest(),
  );
}

// Gera um JWT assinado com HMAC-SHA256 (HS256).
export function gerarToken(usuario: Usuario): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const agora = Math.floor(Date.now() / 1000);

  const payload: TokenPayload = {
    sub: usuario.id,
    usuario: usuario.usuario,
    iat: agora,
    exp: agora + TOKEN_EXPIRACAO_SEGUNDOS,
  };

  const headerEncoded = base64UrlEncode(JSON.stringify(header));
  const payloadEncoded = base64UrlEncode(JSON.stringify(payload));
  const assinatura = assinar(`${headerEncoded}.${payloadEncoded}`);

  return `${headerEncoded}.${payloadEncoded}.${assinatura}`;
}

// Verifica a assinatura e a expiração do token. Retorna o payload se válido.
export function verificarToken(token: string): TokenPayload | null {
  const partes = token.split('.');
  if (partes.length !== 3) return null;

  const [headerEncoded, payloadEncoded, assinatura] = partes;
  if (!headerEncoded || !payloadEncoded || !assinatura) return null;

  const assinaturaEsperada = assinar(`${headerEncoded}.${payloadEncoded}`);

  // Comparação em tempo constante para evitar timing attacks.
  const assinaturaBuffer = base64UrlDecode(assinatura);
  const esperadaBuffer = base64UrlDecode(assinaturaEsperada);
  if (
    assinaturaBuffer.length !== esperadaBuffer.length ||
    !crypto.timingSafeEqual(assinaturaBuffer, esperadaBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(payloadEncoded).toString()) as TokenPayload;
    const agora = Math.floor(Date.now() / 1000);
    if (payload.exp < agora) return null; // token expirado
    return payload;
  } catch {
    return null;
  }
}

// Valida usuário e senha. Retorna o token gerado ou null em caso de falha.
export function autenticar(usuario: string, senha: string): string | null {
  const encontrado = USUARIOS.find(
    (u) => u.usuario === usuario && u.senha === senha,
  );
  if (!encontrado) return null;
  return gerarToken(encontrado);
}

type ResultadoCadastro =
  | { token: string; usuario: string }
  | { erro: string; status: number };

// Cadastra um novo usuário e retorna o token de autenticação.
export function cadastrarUsuario(usuario: string, senha: string): ResultadoCadastro {
  if (!usuario?.trim() || !senha) {
    return { erro: 'Usuário e senha são obrigatórios.', status: 400 };
  }

  if (senha.length < 4) {
    return { erro: 'A senha deve ter pelo menos 4 caracteres.', status: 400 };
  }

  if (USUARIOS.some((u) => u.usuario === usuario.trim())) {
    return { erro: 'Usuário já cadastrado.', status: 409 };
  }

  const novoId =
    USUARIOS.length > 0 ? Math.max(...USUARIOS.map((u) => u.id)) + 1 : 1;
  const novoUsuario: Usuario = { id: novoId, usuario: usuario.trim(), senha };

  USUARIOS.push(novoUsuario);

  return { token: gerarToken(novoUsuario), usuario: novoUsuario.usuario };
}

// Estende o Request do Express para carregar os dados do usuário autenticado.
export interface RequestAutenticado extends Request {
  usuario?: TokenPayload;
}

// Middleware (Guard do backend) que protege rotas exigindo um JWT válido.
export function autenticarMiddleware(
  req: RequestAutenticado,
  res: Response,
  next: NextFunction,
): void {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Token de autenticação não fornecido.' });
    return;
  }

  const token = header.substring('Bearer '.length).trim();
  const payload = verificarToken(token);

  if (!payload) {
    res.status(401).json({ message: 'Token inválido ou expirado.' });
    return;
  }

  req.usuario = payload;
  next();
}
