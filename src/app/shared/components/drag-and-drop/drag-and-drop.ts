import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, signal } from '@angular/core';

@Component({
  selector: 'app-drag-and-drop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './drag-and-drop.html',
  styleUrl: './drag-and-drop.css',
})
export class DragAndDrop {
  @Output() readonly filesChange = new EventEmitter<File[]>();

  protected readonly selectedFiles = signal<File[]>([]);
  protected readonly isDragging = signal(false);
  protected readonly errorMessage = signal('');

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  protected onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
    this.addFiles(event.dataTransfer?.files ?? null);
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.addFiles(input.files);
    input.value = '';
  }

  protected removeFile(fileToRemove: File): void {
    const files = this.selectedFiles().filter((file) => file !== fileToRemove);
    this.selectedFiles.set(files);
    this.filesChange.emit(files);
  }

  protected isImage(file: File): boolean {
    return file.type.startsWith('image/');
  }

  protected previewUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  private addFiles(fileList: FileList | null): void {
    if (!fileList?.length) {
      return;
    }

    const incomingFiles = Array.from(fileList);
    const invalidFile = incomingFiles.find((file) => !file.type || file.size === 0);
    if (invalidFile) {
      this.errorMessage.set(`${invalidFile.name} cannot be added.`);
      return;
    }

    const existingFiles = this.selectedFiles();
    const newFiles = incomingFiles.filter(
      (file) => !existingFiles.some((existingFile) => this.sameFile(existingFile, file)),
    );
    const files = [...existingFiles, ...newFiles];

    this.errorMessage.set('');
    this.selectedFiles.set(files);
    this.filesChange.emit(files);
  }

  private sameFile(firstFile: File, secondFile: File): boolean {
    return (
      firstFile.name === secondFile.name &&
      firstFile.size === secondFile.size &&
      firstFile.lastModified === secondFile.lastModified
    );
  }
}
