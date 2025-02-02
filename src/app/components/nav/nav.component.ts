import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  fabOpen = false; // Controls FAB menu visibility

  constructor(private router: Router) {}

  toggleFabMenu() {
    this.fabOpen = !this.fabOpen;
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
    this.fabOpen = false; // Close menu after navigation
  }
}
