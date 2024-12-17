import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmCardModule } from '@spartan-ng/ui-card-helm';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HlmCardModule],
  templateUrl: './Dashboard.component.html',
  styleUrl: './Dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {}
