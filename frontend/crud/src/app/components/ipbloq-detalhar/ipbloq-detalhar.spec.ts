import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { IpbloqDetalhar } from './ipbloq-detalhar';
import { IpbloqListar } from '../ipbloq-listar/ipbloq-listar';

describe('IpbloqDetalhar', () => {
  let component: IpbloqDetalhar;
  let fixture: ComponentFixture<IpbloqDetalhar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IpbloqDetalhar],
      providers: [
        provideRouter([
          { path: 'listar', component: IpbloqListar },
          { path: 'detalhe/:id', component: IpbloqDetalhar },
        ]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'id' ? '1' : null),
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IpbloqDetalhar);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load registro from service by id', () => {
    expect(component['registro']()?.ip).toBe('192.168.0.14');
  });
});
