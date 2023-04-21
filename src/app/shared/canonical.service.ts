import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CanonicalService {

  constructor(@Inject(DOCUMENT) private document: Document) {}

  updateUrl() {
    const url = this.document.URL.split('?')[0];
    this.getCanonicalLinkElement().setAttribute('href', url);
    this.updateAlternateLinkElements(url.replace(/https?:\/\/[^\/]+\/(en|zh)?\/?/, ''));
  }

  private getCanonicalLinkElement() {
    let element = this.document.querySelector<HTMLLinkElement>(`link[rel='canonical']`);
    if (!element) {
      element = this.document.createElement('link');
      element.setAttribute('rel', 'canonical');
      this.document.head.appendChild(element);
    }

    return element;
  }

  private updateAlternateLinkElements(path: string) {
    const elements = this.document.querySelectorAll<HTMLLinkElement>(`link[rel='alternate']`);

    elements.forEach(element => {
      switch (element.getAttribute('hreflang')) {
        case 'en':
          element.setAttribute('href', `${location.origin}/en/${path}`);
          break;
        case 'zh':
          element.setAttribute('href', `${location.origin}/zh/${path}`);
          break;
        default:
          element.setAttribute('href', `${location.origin}/${path}`);
          break;
      }
    });
  }
}
