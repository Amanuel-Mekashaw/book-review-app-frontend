import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  HlmDialogComponent,
  HlmDialogContentComponent,
  HlmDialogDescriptionDirective,
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
  HlmDialogTitleDirective,
} from '@spartan-ng/ui-dialog-helm';
import { ProfileFormComponent } from '../../UserDashboard/GenreDashboard/GenreForm/GenreForm.component';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-genre-add-modal',
  standalone: true,
  imports: [
    HlmDialogComponent,
    HlmDialogContentComponent,
    HlmDialogDescriptionDirective,
    HlmDialogHeaderComponent,
    HlmDialogTitleDirective,
    ProfileFormComponent,
  ],
  templateUrl: './GenreAddModal.component.html',
  styleUrl: './GenreAddModal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenreAddModalComponent {
  dialogRef = inject(DialogRef);
  dialogData = inject(DIALOG_DATA);

  closeDialog() {
    this.dialogRef.close();
  }
}
