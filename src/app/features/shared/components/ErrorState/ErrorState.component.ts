import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ErrorState.component.html',
  styleUrl: './ErrorState.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorStateComponent {
  @Input() error!: string;
  @Input() heightclass = '';
}
