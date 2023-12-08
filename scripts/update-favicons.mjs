import favicons from 'favicons';
import fs from 'fs/promises';
import path from 'path';

const src = './scripts/favicon.svg'; // Icon source file path.
const dest = './scripts/favicons'; // Output directory path.
const htmlBasename = 'index.html'; // HTML file basename.

const configuration = {
  path: '/src/assets/favicon',
  appName: 'Git Glint',
  appShortName: 'Glint',
  appDescription: 'A powerful graphical user interface application, for interacting with git version control.',
  // Extra options...
};

const response = await favicons(src, configuration);
await fs.mkdir(dest, { recursive: true });
await Promise.all(response.images.map(image => fs.writeFile(path.join(dest, image.name), image.contents)));
await Promise.all(response.files.map(file => fs.writeFile(path.join(dest, file.name), file.contents)));
await fs.writeFile(path.join(dest, htmlBasename), response.html.join('\n'));
