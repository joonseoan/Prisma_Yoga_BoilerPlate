//encoding the password
import bcrypt from 'bcryptjs';
import prisma from '../../src/prisma';

// to implement jwt
// Bear in mind again that this seedData does not go through resover functions
import jwt from 'jsonwebtoken';

export const userOne = {
    input: {
        name: 'Jan',
        email: 'jan@gmail.com',
        password: bcrypt.hashSync('asdfghjk')
    },
    user: undefined,
    jwt: undefined
};

export const userTwo = {
    input: {
        name: 'Kevin',
        email: 'kevin@gmail.com',
        password: bcrypt.hashSync('asdfghjk')
    },
    user: undefined,
    jwt: undefined
};


// 2) To be more modularized
export default async () => {

    await prisma.mutation.deleteManyUsers();

    userOne.user = await prisma.mutation.createUser({
        data: userOne.input
    });
    
    // Keep in mind again that like above, it does not go through the logcal graphql resolvers
    userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.PRISMA_JWT_SECRET);

    userTwo.user = await prisma.mutation.createUser({
        data: userTwo.input
    });

    userTwo.jwt = jwt.sign({ userId: userTwo.user.id }, process.env.PRISMA_JWT_SECRET);
};