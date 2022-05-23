import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Release } from './models/release';

@Injectable({ providedIn: 'root' })
export class GithubService {
  constructor(private http: HttpClient) {}

  getReleases() {
    return this.http.get<Release[]>(`https://api.github.com/repos/logicoversnacks/glint-release/releases`);
  }
}
