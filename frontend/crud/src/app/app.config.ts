import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';

// primeNG
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    providePrimeNG({
            theme: {
                preset: Aura,
                options: {
                  cssLayer: {
                    name: 'primeng',
                    order: 'theme, base, primeng'
                  }
          }
            }
        }),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes)
  ]
};
