// tslint:disable no-console

import { GraphQLServer, Options } from 'graphql-yoga';
import * as path from 'path';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';

async function bootstrap() {
  const schema = await buildSchema({
    resolvers: [path.join(__dirname, '..', 'data', 'resolvers', '*.ts')],
  });

  const server = new GraphQLServer({ schema });
  const port = process.env.PORT || 5000;

  // Configure server options
  const serverOptions: Options = {
    endpoint: '/graphql',
    playground: '/playground',
    port,
  };

  const app = server.express;

  await createConnection();

  await server.start(serverOptions, ({ playground }) => {
    console.log(
      `Server is running, GraphQL Playground available at http://localhost:${port}${playground}`,
    );
  });
}

bootstrap()
  .catch(console.error);
