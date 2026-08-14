import { Express, Router as ExpressRouter } from 'express';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { APP_NAME } from '../application/config/env';
import { ExpressRouterAdapter } from '../application/adapters';
import { container } from '../core/dependency-injection';
import { Routes } from '../core/base';

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

    app.use(`/${APP_NAME}/${version}`, expressRouter);

    if (file.includes('routes') && !file.endsWith('.map')) {
      const RoutesClass = (await import(file)).default;

      container.getInstance<Routes>(RoutesClass).register(router);
    }
  }))
}
