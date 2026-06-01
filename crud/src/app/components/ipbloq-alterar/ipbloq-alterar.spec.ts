import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IpBloqueadoService } from '../../services/ip-bloqueado.service';
import { IpbloqAlterar } from './ipbloq-alterar';

describe('IpbloqAlterar', () => {
  let component: IpbloqAlterar;
  let fixture: ComponentFixture<IpbloqAlterar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IpbloqAlterar],
    }).compileComponents();

    const service = TestBed.inject(IpBloqueadoService);
    service.abrirAlterar({
      id: 1,
      ip: '192.168.0.1',
      tentativas: 5,
      bloqueado: true,
      origem: 'Firewall',
    });

    fixture = TestBed.createComponent(IpbloqAlterar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
