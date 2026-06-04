import { Component } from '@angular/core';
import { Tabs } from '../tabs/tabs';
import { TabItem } from '../tab-item/tab-item';

@Component({
  selector: 'app-dashboard',
  imports: [Tabs, TabItem],
  templateUrl: './dashboard.html',
})
export class Dashboard {}
