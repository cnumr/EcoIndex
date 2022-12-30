import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const f = fileURLToPath(import.meta.url);
const dirname = path.dirname(f);
const filename = `${dirname}/../package.hugo.json`;
const manifest = readFileSync(filename, 'utf8');
const data = {
  ...JSON.parse(manifest),
  version: process.env.npm_package_version,
};

writeFileSync(filename, JSON.stringify(data, null, 2), 'utf8');