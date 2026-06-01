import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IpBloqueadoService } from '../../services/ip-bloqueado.service';
import { IpbloqDetalhar } from './ipbloq-detalhar';

describe('IpbloqDetalhar', () => {
  let component: IpbloqDetalhar;
  let fixture: ComponentFixture<IpbloqDetalhar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IpbloqDetalhar],
    }).compileComponents();

    const service = TestBed.inject(IpBloqueadoService);
    service.detalhar({
      id: 1,
      ip: '192.168.0.1',
      tentativas: 5,
      bloqueado: true,
      origem: 'Firewall',
    });

    fixture = TestBed.createComponent(IpbloqDetalhar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
