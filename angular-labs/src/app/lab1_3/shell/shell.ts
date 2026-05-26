import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [Navbar, Sidebar],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class Shell {}
