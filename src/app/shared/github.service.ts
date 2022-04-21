import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface IRelease {
  html_url: string;
  name: string;
  draft: boolean;
  prerelease: boolean;
  published_at: string;
  assets: {
    browser_download_url: string;
    name: string;
  }[];
}

@Injectable({ providedIn: 'root' })
export class GithubService {
  constructor(private http: HttpClient) {}

  getReleases() {
    return this.http.get<IRelease[]>(`https://api.github.com/repos/logicoversnacks/glint-release/releases`);
  }
}
