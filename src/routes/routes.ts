import { Express, Router as ExpressRouter } from 'express';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { ExpressRouterAdapter } from '../application/adapters';

const deepReadDir = async (dirPath: string) => await Promise.all(
  (await readdir(dirPath, { withFileTypes: true })).map(async (dirent) => {
    const path = join(dirPath, dirent.name)
    return dirent.isDirectory() ? await deepReadDir(path) : path
  }),
)

export default async (app: Express): Promise<void> => {
  const expressRouter = ExpressRouter();
  const router = new ExpressRouterAdapter(expressRouter);
  const files = (await deepReadDir(join(__dirname, '../domains'))).flat(Number.POSITIVE_INFINITY);
  await Promise.all(files.map(async (file: string) => {
    const filePath = file.split('/');
    const domainIndex = filePath.findIndex((folder) => folder === 'domains');
    const version = filePath[domainIndex + 1]

    app.use(`/rest-api/${version}`, expressRouter);

    if (file.includes('routes') && !file.endsWith('.map')) {
      (await import(file)).default(router);
    }
  }))
}
