import { Component } from '@angular/core';
import { ChatContainer } from './lab2_6/chat-container/chat-container';
import { UserProfileContainer } from './lab2_5/user-profile-container/user-profile-container';
import { RatingDashboard } from './lab2_4/rating-dashboard/rating-dashboard';
import { ProductList } from './lab2_3/product-list/product-list';
import { Dashboard } from './lab2_7/dashboard/dashboard';
import { Highlight } from './lab2_1/directives/hover-highlight';
import { DashboardComponent } from './lab2_2/dashboard/dashboard';
import { Container } from './lab2_8/container/container';
import { SystemStatus } from './lab2_9/system-status/system-status';
import { TaskContainer } from './lab2_10/task-container/task-container';

@Component({
  selector: 'app-week2',

  imports: [
    ChatContainer,
    Highlight,
    DashboardComponent,
    ProductList,
    RatingDashboard,
    UserProfileContainer,
    ChatContainer,
    Container,
    TaskContainer,
  ],
  templateUrl: './week2.html',
})
export class Week2 {}
