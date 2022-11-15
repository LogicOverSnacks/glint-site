import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `:host {
      display: block;
      padding-top: 40px;
    }`
  ],
  template: `
    <app-container>
      <mat-spinner *ngIf="loading"></mat-spinner>
      <markdown [data]="doc" (ready)="onReady()"></markdown>
    </app-container>
  `
})
export class DocComponent implements OnInit {
  doc?: string;
  loading = true;

  constructor(
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.doc = this.route.snapshot.data.doc;
  }

  onReady() {
    this.loading = false;
    this.cdr.detectChanges();
  }
}
