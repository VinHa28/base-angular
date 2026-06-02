import {
  AfterContentChecked,
  AfterContentInit,
  Component,
  ContentChild,
  ElementRef,
  OnInit,
} from '@angular/core';
import { TabItem } from '../tab-item/tab-item';
import { read } from 'node:fs';

@Component({
  selector: 'app-tabs',
  imports: [],
  templateUrl: './tabs.html',
})
export class Tabs implements OnInit, AfterContentInit {
  @ContentChild('firstTab', { read: ElementRef }) tabItem!: ElementRef;

  ngAfterContentInit(): void {
    console.log('Tại ngAfterContentInit:');
    if (this.tabItem)
      console.log(
        'Value tại ngAfterContentIntit:',
        this.tabItem.nativeElement?.getAttribute('title'),
      );
    else console.log('Value tại ngAfterContentInit:', this.tabItem);
  }

  ngOnInit(): void {
    console.log('Tại ngOnInit');
    if (this.tabItem) console.log('Value Tại ngOnInit:', this.tabItem);
    else console.log('Value tại ngOnInit:', this.tabItem);
  }
}
