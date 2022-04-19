import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./download.component.scss'],
  templateUrl: './download.component.html'
})
export class DownloadComponent {}
