import { Component, input, OnDestroy, OnInit } from '@angular/core';

import { ToastData } from '@/shared/components/toast/interfaces/toast.interfaces';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.html',
})
export class Toast implements OnDestroy, OnInit {
  public readonly data = input.required<ToastData>();

  private timer?: number;
  private remaining = 0;
  private start = 0;

  ngOnInit() {
    const duration = this.data().duration;

    if (duration > 0) {
      this.startTimer(duration);
    }
  }

  ngOnDestroy() {
    clearTimeout(this.timer);
  }

  protected close(): void {
    this.data().ref.close();
  }

  private startTimer(duration: number) {
    this.remaining = duration;
    this.start = Date.now();

    this.timer = window.setTimeout(() => {
      this.data().ref.close();
    }, duration);
  }

  protected pauseTimer() {
    clearTimeout(this.timer);
    const elapsed = Date.now() - this.start;
    this.remaining -= elapsed;
  }

  protected resumeTimer() {
    if (this.remaining <= 0) {
      return;
    }

    this.start = Date.now();

    this.timer = window.setTimeout(() => {
      this.data().ref.close();
    }, this.remaining);
  }
}
