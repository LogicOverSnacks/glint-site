/* eslint-disable @typescript-eslint/naming-convention */
export interface Release {
  html_url: string;
  name: string;
  tag_name: string;
  draft: boolean;
  prerelease: boolean;
  published_at: string;
  assets: {
    browser_download_url: string;
    name: string;
  }[];
}
