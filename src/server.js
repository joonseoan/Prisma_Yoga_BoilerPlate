import { GraphQLServer, PubSub } from 'graphql-yoga';

import { resolvers, fragmentReplacements } from './resolvers';
import prisma from './prisma';

export default new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context(request) {
        return {
            PubSub,
            prisma,
            request
        }
    },
    fragmentReplacements
});

