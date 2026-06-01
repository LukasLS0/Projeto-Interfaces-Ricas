export interface IpBloqueado {
  id: number;
  ip: string;
  tentativas: number;
  bloqueado: boolean;
  origem: string;
}

export const inicialIpBloq: IpBloqueado = {
  id: 0,
  ip: '',
  tentativas: 0,
  bloqueado: false,
  origem: '',
};

export type ViewMode = 'listar' | 'incluir' | 'detalhar' | 'alterar';
