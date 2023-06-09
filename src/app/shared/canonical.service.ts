import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CanonicalService {

  constructor(@Inject(DOCUMENT) private document: Document) {}

  updateUrl() {
    const url = this.document.URL.split('?')[0];
    this.updateCanonicalLinkElement(url.replace(/https?:\/\/[^\/]+\/?/, ''));
    this.updateAlternateLinkElements(url.replace(/https?:\/\/[^\/]+\/(en|zh)?\/?/, ''));
  }

  private updateCanonicalLinkElement(path: string) {
    let element = this.document.querySelector<HTMLLinkElement>(`link[rel='canonical']`);
    if (!element) {
      element = this.document.createElement('link');
      element.setAttribute('rel', 'canonical');
      this.document.head.appendChild(element);
    }

    element.setAttribute('href', path ? `${location.origin}/${path}` : location.origin);
  }

  private updateAlternateLinkElements(path: string) {
    const elements = this.document.querySelectorAll<HTMLLinkElement>(`link[rel='alternate']`);

    elements.forEach(element => {
      switch (element.getAttribute('hreflang')) {
        case 'en':
          element.setAttribute('href', path ? `${location.origin}/en/${path}` : `${location.origin}/en`);
          break;
        case 'zh':
          element.setAttribute('href', path ? `${location.origin}/zh/${path}` : `${location.origin}/zh`);
          break;
        default:
          element.setAttribute('href', path ? `${location.origin}/${path}` : location.origin);
          break;
      }
    });
  }
}
