import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { catchError, EMPTY, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DocsResolver implements Resolve<Observable<string>> {
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<string> {
    return this.http.get(`/assets/docs/${route.paramMap.get('file')}.md`, { responseType: 'text' }).pipe(
      catchError(() => {
        this.router.navigate(['/not-found']);
        return EMPTY;
      })
    );
  }
}
