import 'cross-fetch/polyfill';
import getClient from './utils/getClient';
import prisma from '../src/prisma';

const client = getClient();

 
import seedDatabase, { userOne } from './utils/seedDatabase';

import { createUser, getProfile, getUsers, login } from './utils/user_operations';
beforeEach(seedDatabase);

test('Should create a new user', async () => {

    const variables = {
        data: {
            email: "jsons@jsons.com",
            name: "Jsons Andrew",
            password: "asdfghjk"
        }
    }

    const response = await client.mutate({ 
        mutation: createUser, 
        variables
    });

    const userVerified = await prisma.exists.User({ id: response.data.createUser.user.id });
    expect(userVerified).toBe(true);

});

test('should expose public author profile', async () => {

    const response = await client.query({ query: getUsers });
    expect(response.data.users.length).toBe(2);
    expect(response.data.users[0].email).toBe(null);
    expect(response.data.users[0].name).toBe('Jan');

});

test('should throw an error with bad credentials', async () => {

    const variables = {
        data: {
            email: "jan@gmail.com",
            password: "asdf"
        }
    }

    await expect(
        client.mutate({ mutation: login, variables })
    ).rejects.toThrow();

});

test('should throw an error with invalid password', async () => {

    const variables = {
        data: {
            email: "aaa@aaa.com",
            name: "Jeffry",
            password: "aaa"
        }
    }

    await expect(
        client.mutate({ mutation: createUser, variables })
    ).rejects.toThrow();
    
});

test('Should fetch user profile', async () => {

    const client = getClient(userOne.jwt);
    const { data } = await client.query({ query: getProfile });
    expect(data.me.id).toBe(userOne.user.id);
    expect(data.me.name).toBe(userOne.user.name);
    expect(data.me.email).toBe(userOne.user.email);

});



// 1) [Basic ]
// import { getFirstName, isValidPassword } from '../src/utils/user';

// "test" allowes us to define individual test case.

// test('This is my first jest', () => {
    
// });

// test('Andrews challenge', () => {
    
// });

// test('should return first name when given full name', () => {
//     const firstName = getFirstName('Mike Hyashi');
//     // IMPORTANT!!!!
//     // if run throw error, jest think it has an error
//     // throw new Error('This should trigger a failure.')

//     // (old one)
//     // if(firstName !== 'Mike') throw new Error('This should trigger a failure.');
    
//     // By using expect..
//     expect(firstName).toBe('Mike');
// });

// test('shold return first name when given the first name', () => {
//     const firstName = getFirstName('Jan');
//     expect(firstName).toBe('Jan');
// });

// test('shold reject password shorter than 8 letters', () => {
//     const password = isValidPassword('abcd');
//     expect(password).toBe(false);
// });

// test('shold reject password does not include password word', () => {
//     const password = isValidPassword('aafcgafadfasdf');
//     expect(password).toBe(false);
// });

