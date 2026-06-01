import { ComponentFixture, TestBed } from '@angular/core/testing';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { IpbloqListar } from './ipbloq-listar';

describe('IpbloqListar', () => {
  let component: IpbloqListar;
  let fixture: ComponentFixture<IpbloqListar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IpbloqListar],
      providers: [
        providePrimeNG({
          theme: { preset: Aura },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IpbloqListar);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('items', [
      { id: 1, ip: '192.168.0.1', tentativas: 5, bloqueado: true, origem: 'Firewall' },
    ]);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
