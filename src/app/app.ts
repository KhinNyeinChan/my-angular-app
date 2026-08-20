import { Component, OnInit, ChangeDetectorRef, signal } from '@angular/core';
import Quill from 'quill';
import { QuillRichEditor } from './shared/components/quill-rich-editor/quill-rich-editor';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, QuillRichEditor],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('my-angular-app');
}
