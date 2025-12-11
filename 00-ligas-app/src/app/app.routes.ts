import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'league-classification-table',
    pathMatch: 'full',
  },
  {
    path: 'league-classification-table',
    loadComponent: () => import('./pages/league-classification-table/league-classification-table.page').then( m => m.LeagueClassificationTablePage)
  }
];
