import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { appConfig } from './app/app.routes';
import { MessageService } from 'primeng/api';
import 'zone.js';

bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig,
    provideHttpClient(withFetch()), // Proveer HttpClient aquí
    MessageService
  ]
}).catch((err) => console.error(err));
