import { Routes, provideRouter } from '@angular/router';
import { PokemonSearchComponent } from './pokemon-search/pokemon-search.component';

export const routes: Routes = [
    {
        path: '',
        component: PokemonSearchComponent
    }
];

export const appConfig = [
  provideRouter(routes) // Proveer el enrutador con las rutas definidas
];


