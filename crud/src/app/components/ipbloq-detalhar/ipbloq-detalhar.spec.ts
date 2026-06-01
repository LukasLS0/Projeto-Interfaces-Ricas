import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IpbloqDetalhar } from './ipbloq-detalhar';

describe('IpbloqDetalhar', () => {
  let component: IpbloqDetalhar;
  let fixture: ComponentFixture<IpbloqDetalhar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IpbloqDetalhar],
    }).compileComponents();

    fixture = TestBed.createComponent(IpbloqDetalhar);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('registro', {
      id: 1,
      ip: '192.168.0.1',
      tentativas: 5,
      bloqueado: true,
      origem: 'Firewall',
    });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
