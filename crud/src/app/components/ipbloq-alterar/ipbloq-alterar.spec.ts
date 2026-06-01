import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { IpbloqAlterar } from './ipbloq-alterar';
import { IpbloqListar } from '../ipbloq-listar/ipbloq-listar';

describe('IpbloqAlterar', () => {
  let component: IpbloqAlterar;
  let fixture: ComponentFixture<IpbloqAlterar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IpbloqAlterar],
      providers: [
        provideRouter([
          { path: 'listar', component: IpbloqListar },
          { path: 'alterar/:id', component: IpbloqAlterar },
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

    fixture = TestBed.createComponent(IpbloqAlterar);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
