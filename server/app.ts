import * as http from 'http';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import * as compression from 'compression';
import * as routes from './routes';
import * as morgan from 'morgan';
import * as Knex from 'knex';
import { Model } from 'objection';

/** Redis */
// import { Init } from './db/redis';
// Init();

/** MySQL */
// import { mysql } from './db/mysql';
// const knex = Knex(mysql.development);

/** PostgreSQL */
import { pgsql } from './db/postgres';
import {AddressInfo} from "net";
const knex = Knex(pgsql.development);

/** Bind all Models to a knex instance. If you only have one database in
 *  your server this is all you have to do. For multi database systems, see
 *  the Model.bindKnex method.
 */
Model.knex(knex);

const _clientDir = '../angular-express';

export const app: express.Application = express();

app
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  .use(bodyParser.text())
  .use(morgan('dev'))
  .use(compression());

if (process.env.NODE_ENV && process.env.NODE_ENV === 'development') {

  app.all('/*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    next();
  });
}

/**
 * Api Routes
 */
routes.init(app);

/**
 * Static
 */
app.use('/', express.static(path.resolve(__dirname, `${_clientDir}/`)));

/**
 * Spa Res Sender
 */
const renderIndex = (req: express.Request, res: express.Response) => {
  res.sendFile(path.resolve(__dirname, `${_clientDir}/index.html`));
};

/**
 * Prevent server routing and use @ng2-router.
 */
app.get('/*', renderIndex);

/**
 * Server with gzip compression.
 */
const serverPort = 3000;
const server: http.Server = app.listen(serverPort);

console.log(`App is listening on port: ${serverPort}`);
