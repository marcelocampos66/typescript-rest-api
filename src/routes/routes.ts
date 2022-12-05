import { Express, Router } from 'express';
import { readdir } from 'fs/promises';
import { join } from 'path';

const deepReadDir = async (dirPath: string) => await Promise.all(
  (await readdir(dirPath, {withFileTypes: true})).map(async (dirent) => {
    const path = join(dirPath, dirent.name)
    return dirent.isDirectory() ? await deepReadDir(path) : path
  }),
)

export default async (app: Express): Promise<void> => {
  const router = Router();
  app.use('/rest-api', router);
  (await deepReadDir(join(__dirname, '../domains'))).flat(Number.POSITIVE_INFINITY).map(async (file: string) => {
    if (file.includes('routes') && !file.endsWith('.map')) {
      (await import(file)).default(router);
    }
  })
}
