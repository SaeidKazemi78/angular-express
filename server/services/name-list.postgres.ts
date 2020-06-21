import * as express from 'express';
import { Scientist } from '../models/Scientist';
import { ScientistInterface } from '../interfaces/scientist.interface';

export function nameListPostgres(app: express.Application) {

  /**
   * Get name list
   */
  app.get('/api/name-list/pgsql',
    async (req: express.Request, res: express.Response,
     next: express.NextFunction) => {

      const names = await Scientist.query()
        .skipUndefined()
        .eager(req.query)
        .orderBy('first_name')
        .map(({ first_name, last_name }: ScientistInterface) => `${first_name} ${last_name}`);

      res.send(names);
    });
}
