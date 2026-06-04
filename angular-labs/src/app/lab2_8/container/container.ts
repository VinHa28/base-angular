import { Component } from '@angular/core';
import { DynaAccordion } from '../dyna-accordion/dyna-accordion';

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [DynaAccordion],
  template: `
    <div class="mt-5 mx-auto flex flex-col justify-center items-center">
      <div class="mb-5">
        <button
          (click)="addTextContent()"
          class="text-white py-2 px-3 rounded-xl cursor-pointer hover:opacity-75 bg-blue-500"
        >
          Thêm văn bản dài
        </button>
        <button
          (click)="removeText()"
          class="ml-4 text-white py-2 px-3 rounded-xl cursor-pointer hover:opacity-75 bg-red-400"
        >
          Xóa bớt văn bản
        </button>
      </div>

      <app-dyna-accordion>
        @for (text of textList; track $index) {
          <p
            #contentParam
            class="text-sm text-gray-600 px-3.5 py-2.5 border-l-[3px] border-blue-400 bg-blue-50/60 rounded-r-md m-0"
          >
            {{ text }}
          </p>
        }
      </app-dyna-accordion>
    </div>
  `,
})
export class Container {
  textList: string[] = ['Đoạn văn bản đầu tiên khởi tạo cho bài Lab 2.8.'];
  sampleTexts: string[] = [
    'Hàm ngAfterContentChecked giúp bắt trọn mọi khoảnh khắc thay đổi của Projected Content.',
    'Layout sẽ tự tính toán scrollHeight và tăng height tương ứng để tránh bị vỡ giao diện web.',
    'Bằng cơ chế bất đồng bộ như setTimeout nhé bạn học viên!',
  ];
  addTextContent() {
    const randomIndex = Math.floor(Math.random() * this.sampleTexts.length);
    this.textList.push(this.sampleTexts[randomIndex]);
  }
  removeText() {
    if (this.textList.length > 0) {
      this.textList.pop();
    }
  }
}
