import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter(routes),
        providePrimeNG({
          theme: {
            preset: Aura,
          },
        }),
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Gerenciamento de IPs Bloqueados',
    );
  });

  it('should navigate to listar route', async () => {
    TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/listar');
    expect(router.url).toBe('/listar');
  });
});
