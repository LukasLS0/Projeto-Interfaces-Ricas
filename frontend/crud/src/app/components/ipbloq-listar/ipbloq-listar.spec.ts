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
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
