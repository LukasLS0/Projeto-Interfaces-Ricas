import type { IpBloqueado } from './ip-bloqueado';

/** Chave do estado enviado pela listagem ao navegar para detalhe/alteração. */
export const IP_BLOQUEADO_NAV_STATE = 'ipBloqueado';

export function ipBloqueadoDoEstadoDaNavegacao(): IpBloqueado | undefined {
  const value = history.state?.[IP_BLOQUEADO_NAV_STATE];
  return value && typeof value === 'object' ? (value as IpBloqueado) : undefined;
}
