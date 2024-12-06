import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-state',
  standalone: true,
  imports: [LoadingSpinnerComponent, CommonModule],
  templateUrl: './LoadingState.component.html',
  styleUrl: './LoadingState.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingStateComponent {
  @Input() loading!: boolean;
  @Input() loadingText!: string;
}
