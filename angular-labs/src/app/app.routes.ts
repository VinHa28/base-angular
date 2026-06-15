import { Routes } from '@angular/router';
import { Week1 } from './week1/week1';
import { Week2 } from './week2/week2';
import { Week3 } from './week3/week3';
import { Week4 } from './week4/week4';
import { Login } from './pages/login/login';

export const routes: Routes = [
  { path: '', component: Week1 },
  { path: 'week1', component: Week1 },
  { path: 'week2', component: Week2 },
  { path: 'week3', component: Week3 },
  { path: 'week4', component: Week4 },
  { path: 'login', component: Login },
];
