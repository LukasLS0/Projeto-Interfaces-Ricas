import { TestBed } from '@angular/core/testing';
import { IpBloqueadoService } from './ip-bloqueado.service';

describe('IpBloqueadoService', () => {
  let service: IpBloqueadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IpBloqueadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should listar registros iniciais', () => {
    expect(service.listar().length).toBe(3);
  });

  it('should inserir um novo registro', () => {
    const total = service.listar().length;
    service.inserir({
      id: 0,
      ip: '192.168.1.1',
      tentativas: 3,
      bloqueado: false,
      origem: 'Teste',
    });
    expect(service.listar().length).toBe(total + 1);
  });

  it('should atualizar um registro existente', () => {
    const registro = service.listar()[0];
    service.atualizar({ ...registro, ip: '10.0.0.1' });
    expect(service.listar()[0].ip).toBe('10.0.0.1');
  });

  it('should remover um registro', () => {
    const id = service.listar()[0].id;
    service.remover(id);
    expect(service.listar().find((ip) => ip.id === id)).toBeUndefined();
  });

  it('should buscarPorId', () => {
    const registro = service.buscarPorId(1);
    expect(registro?.ip).toBe('192.168.0.14');
  });
});
