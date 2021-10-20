import mongoose from 'mongoose';
import util from 'util';
import debug from 'debug';
// import Agenda from 'agenda';
import config from './config/config';
import app from './config/express';
// import tasksSettings from './config/tasks';

// debug
debug('es6-express-mongoose-jest-boilerplate:index');

mongoose.Promise = Promise;

// connect to mongo db
const mongoUri = config.mongo.host;
mongoose.connect(mongoUri, { useNewUrlParser: true });
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});

// print mongoose logs in dev env
if (config.mongooseDebug) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}

// const agenda = new Agenda(tasksSettings);
// agenda.processEvery("6 hours");

if (!module.parent) {
  // listen on port config.port
  app.listen(config.port, () => {
    console.info(`server started on port ${config.port} (${config.env})`); // eslint-disable-line no-console
  });
}

export default app;
