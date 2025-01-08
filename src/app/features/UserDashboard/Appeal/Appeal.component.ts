import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeroHeaderComponent } from '../../shared/components/HeroHeader/HeroHeader.component';
import { AppealFormComponent } from './AppealForm/AppealForm.component';

@Component({
  selector: 'app-appeal',
  standalone: true,
  imports: [HeroHeaderComponent, AppealFormComponent],
  templateUrl: './Appeal.component.html',
  styleUrl: './Appeal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppealComponent {}
