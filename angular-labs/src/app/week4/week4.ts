import { Component } from '@angular/core';
import { ProductSearch } from "./components/product-search/product-search";
import { UserProfileDashboard } from "./components/user-profile-dashboard/user-profile-dashboard";

@Component({
  selector: 'app-week4',
  imports: [ProductSearch, UserProfileDashboard],
  templateUrl: './week4.html',
})
export class Week4 {}
