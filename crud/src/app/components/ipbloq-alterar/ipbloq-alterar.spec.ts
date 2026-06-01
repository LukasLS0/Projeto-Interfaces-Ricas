import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IpbloqAlterar } from './ipbloq-alterar';

describe('IpbloqAlterar', () => {
  let component: IpbloqAlterar;
  let fixture: ComponentFixture<IpbloqAlterar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IpbloqAlterar],
    }).compileComponents();

    fixture = TestBed.createComponent(IpbloqAlterar);
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
