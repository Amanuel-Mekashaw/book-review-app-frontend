import { Component, inject, OnInit } from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";

import { BrnSelectImports } from "@spartan-ng/ui-select-brain";
import { HlmSelectImports } from "@spartan-ng/ui-select-helm";

import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { AuthService } from "./features/Auth/auth.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    RouterOutlet,
    BrnSelectImports,
    HlmSelectImports,
    FormsModule,
    CommonModule,
  ],
  providers: [],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent implements OnInit {
  title = "bookreviewapp";

  authService = inject(AuthService);
  router = inject(Router);

  ngOnInit(): void {
    if (this.authService.currentUserSignal() !== null) {
      this.router.navigateByUrl("/books");
    } else {
      this.router.navigateByUrl("/login");
    }
  }
}
