import { Injectable } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';
import Profile from '../models/Profile';
import Order from '../models/Order';
import { Settings } from 'http2';
import UserSettings from '../models/UserSettings';

@Injectable({
  providedIn: 'root',
})
export class userService {
  getProfile(): Observable<Profile> {
    const profile: Profile = { id: 1, name: 'Hà Văn Vinh', email: 'vinhhv28@gmail.com' };
    return of(profile).pipe(delay(1000));
  }

  // getOrders(): Observable<Order[]> {
  //   const orders: Order[] = [
  //     { orderId: 'ORD001', total: 500 },
  //     { orderId: 'ORD002', total: 12000 },
  //   ];

  //   return of(orders).pipe(delay(3000));
  // }

  getOrders(): Observable<any> {
    return throwError(() => new Error('Lỗi 500: Server không phản hồi'));
  }

  getSettings(): Observable<UserSettings> {
    const settings: UserSettings = { theme: 'dark', notifications: true };
    return of(settings).pipe(delay(2000));
  }
}
