import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
  signal,
} from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { Rating } from '../../../../rating.interface';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../Auth/auth.service';
import { NoBooksFoundComponent } from '../NoElementFound/NoElementFound.component';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule, NoBooksFoundComponent],
  templateUrl: './Comment.component.html',
  styleUrl: './Comment.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentComponent implements OnInit {
  @Input() edit: boolean;
  @Input() ratings: Rating[];

  authService = inject(AuthService);

  nums = signal<number[] | []>([]);
  isCommentsOpen = signal<boolean>(true);

  ngOnInit(): void {
    console.log('Ratings recieved to comments', this.ratings);
    this.nums.set(
      Array.from(Array(this.ratings?.length).keys())
        .map((num) => num + 1)
        .reverse(),
    );
  }

  getArrayFromNumber(length: number): any[] {
    return new Array(length);
  }

  toggleComments(): void {
    this.isCommentsOpen.update((prev) => !prev);
    console.log('toggled comment', this.isCommentsOpen());
  }
}
