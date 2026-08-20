import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuillEditorComponent } from 'ngx-quill';
import Quill from 'quill';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';

@Component({
  selector: 'app-quill-rich-editor',
  standalone: true,
  imports: [FormsModule, QuillEditorComponent, SafeHtmlPipe],
  templateUrl: './quill-rich-editor.html',
  styleUrl: './quill-rich-editor.css',
})
export class QuillRichEditor implements OnInit {
  editorContent: string = '';
  quillModules: any = {};
  isReady: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    try {
      // 1. Global window.Quill ကို အရင်သတ်မှတ်ပါ
      (window as any).Quill = Quill;

      // 2. Module ကို ယူပါ (esbuild အလုပ်လုပ်ပုံအရ default ပါ/မပါ စစ်ဆေးပါမည်)
      const resizeModule = await import('quill-image-resize-module-v2');
      const ImageResize = resizeModule.default || resizeModule;

      // 3. Register လုပ်ပါ
      Quill.register('modules/imageResize', ImageResize, true);

      // 4. Config သတ်မှတ်ပါ
      this.quillModules = {
        // toolbar: [
        //   ['bold', 'italic', 'underline'],
        //   ['link', 'image'],
        // ],
        imageResize: {
          displaySize: true,
        },
      };
    } catch (error) {
      console.error('Image Resize Module Error:', error);
      // Resize module error တက်ခဲ့ရင်တောင် Editor ပုံမှန်အတိုင်း ပွင့်လာစေရန် Config ကို အလွတ်ထားပေးပါမည်
      this.quillModules = {
        toolbar: [
          ['bold', 'italic', 'underline'],
          ['link', 'image'],
        ],
      };
    } finally {
      // 5. အားလုံးပြီးမှ Editor ကို Render လုပ်ခိုင်းပါမည်
      this.isReady = true;
      this.cdr.detectChanges();
    }
  }

  addTooltips(quillInstance: any) {
    // Toolbar Container ကို လှမ်းယူပါမည်
    const toolbar = quillInstance.getModule('toolbar');
    const toolbarElement = toolbar.container;

    // Icon (Class Name) နှင့် Tooltip တွင် ပြချင်သော စာသားများကို သတ်မှတ်ပါ
    const tooltips: { [key: string]: string } = {
      'ql-bold': 'Bold',
      'ql-italic': 'Italic',
      'ql-underline': 'Underline',
      'ql-strike': 'Strikethrough',
      'ql-blockquote': 'Blockquote',
      'ql-code-block': 'Code Block',
      'ql-header': 'Header',
      'ql-list': 'List',
      'ql-script': 'Script',
      'ql-indent': 'Indent',
      'ql-direction': 'Text Direction',
      'ql-size': 'Font Size',
      'ql-font': 'Font Style',
      'ql-align': 'Alignment',
      'ql-color': 'Text Color',
      'ql-background': 'Background Color',
      'ql-link': 'Insert Link',
      'ql-image': 'Insert Image',
      'ql-video': 'Insert Video',
      'ql-clean': 'Remove Formatting',
    };

    // Toolbar အတွင်းရှိ Button အားလုံးကို ရှာပြီး title attribute လိုက်ထည့်ပေးပါမည်
    const buttons = toolbarElement.querySelectorAll('button');
    buttons.forEach((button: HTMLButtonElement) => {
      // button တွင်ရှိသော class များထဲမှ ql- ဖြင့်စသော class ကို ရှာပါ
      const className = Array.from(button.classList).find((c) => c.startsWith('ql-'));

      if (className && tooltips[className]) {
        button.setAttribute('title', tooltips[className]);
      }
    });

    // Dropdown (Select) များအတွက်ပါ Tooltip ထည့်လိုပါက အောက်ပါအတိုင်း ထပ်ထည့်နိုင်ပါသည်
    const pickers = toolbarElement.querySelectorAll('.ql-picker-label');
    pickers.forEach((picker: HTMLElement) => {
      const parent = picker.parentElement;
      if (parent) {
        const className = Array.from(parent.classList).find((c) => c.startsWith('ql-'));
        if (className && tooltips[className]) {
          picker.setAttribute('title', tooltips[className]);
        }
      }
    });
  }
}
