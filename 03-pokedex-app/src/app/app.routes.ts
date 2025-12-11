import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'list-pokemon',
    pathMatch: 'full',
  },
  {
    path: 'list-pokemon',
    loadComponent: () => import('./pages/list-pokemon/list-pokemon.page').then( m => m.ListPokemonPage)
  },
  {
    path: 'detail-pokemon/:id',
    loadComponent: () => import('./pages/detail-pokemon/detail-pokemon.page').then( m => m.DetailPokemonPage)
  },
];
