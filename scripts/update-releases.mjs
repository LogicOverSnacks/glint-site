import fs from 'fs';
import https from 'https';
import path from 'path';

await new Promise((resolve, reject) => {
  const filePath = path.resolve('src/assets', 'releases.json');
  https
    .get(
      'https://api.github.com/repos/logicoversnacks/glint-release/releases',
      {
        headers: { 'User-Agent': 'nodejs' }
      },
      response => {
        if (response.statusCode !== 200) {
          reject(`Server responded with ${response.statusCode}: ${response.statusMessage}`);
          return;
        }

        const stream = fs.createWriteStream(filePath, { flags: 'w' });
        stream.on('finish', resolve);
        stream.on('error', error => {
          stream.close();
          fs.unlink(filePath, () => reject(error.message));
        });
        response.pipe(stream);
      }
    )
    .on('error', error => reject(error.message));
});
