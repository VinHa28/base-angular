import { Component, inject, OnInit, signal } from '@angular/core';
import { userService } from '../../services/user.service';
import Profile from '../../models/Profile';
import Order from '../../models/Order';
import UserSettings from '../../models/UserSettings';
import { catchError, forkJoin, of } from 'rxjs';
import { error } from 'console';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile-dashboard',
  imports: [CommonModule],
  templateUrl: './user-profile-dashboard.html',
})
export class UserProfileDashboard implements OnInit {
  private userService = inject(userService);

  isLoading = signal(true);

  userData: {
    profile?: Profile | null;
    orders?: Order[] | null;
    settings?: UserSettings | null;
  } | null = null;
  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading.set(true);

    forkJoin({
      profile: this.userService.getProfile().pipe(
        catchError((error) => {
          console.error('Profile Error', error);
          return of(null);
        }),
      ),
      orders: this.userService.getOrders().pipe(
        catchError((error) => {
          console.error('Orders Error', error);
          return of(null);
        }),
      ),
      settings: this.userService.getSettings().pipe(
        catchError((error) => {
          console.error('Settings Error', error);
          return of(null);
        }),
      ),
    }).subscribe({
      next: (results) => {
        // results sẽ là object {profile: , orders: , settings: }
        this.userData = results;
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Co loi xay ra', error);
        this.isLoading.set(false);
      },
    });
  }
}
