import * as express from 'express';

import { nameListStatic } from './name-list.static';
import { nameListRedis } from './name-list.redis';
import { nameListMysql } from './name-list.mysql';
import { nameListPostgres } from './name-list.postgres';

export function init(app: express.Application) {
  nameListStatic(app);
  nameListRedis(app);
  nameListMysql(app);
  nameListPostgres(app);
}
