import getUserId from '../utils/getUserId';

const Query = {
    users(parent, { query, first, skip, after, orderBy }, { prisma }, info) {
        
        const opArgs = {
            first,
            skip,
            after,
            orderBy
        };

        if(query) {
            opArgs.where = {
                AND: [{
                    name_contains: query
                }]                                 
            }
        }

        return prisma.query.users(opArgs, info);
    },
    async me(parent, args, { prisma, request }, info) {
        
        const userId = getUserId(request);
        const user = await prisma.query.user({
            where: { id: userId }
        }, info);

        if(!user) throw new Error('Unable to find the user');
        return user;
    },
}

export default Query;