import bcrypt from 'bcryptjs';

import getUserId from '../utils/getUserId';
import getToken from '../utils/createToken';
import getHashPassword from '../utils/hashPassword';

const Mutation = {
    async createUser(parent, { data }, { prisma }, info) {

        const password = await getHashPassword(data.password);
        const user = await prisma.mutation.createUser({ 
            data: {
               ...data, 
               password
            } 
        });
        
        return {
            user,
            token: getToken(user.id)
        };

     },
     async updateUser(parent, { data }, { prisma, request }, info) {
        
        const id = getUserId(request);

        if(typeof data.password === 'string') {
            data.password = await getHashPassword(data.password);
        }

        const userExist = await prisma.exists.User({ id });
        if(!userExist) throw new Error('The does not exist.');
        
        return await prisma.mutation.updateUser({
            where: { id },
            data
        }, info);
     },
     async deleteUser(parent, args, { prisma, request }, info) {

        const id = getUserId(request);
        
        const userExist = await prisma.exists.User({ id });
        if(!userExist) throw new Error ('The ID does not exist.');

        return await prisma.mutation.deleteUser({ where: { id }}, info);
        
     },
     async login(parent, { data: { email, password }}, { prisma }, info) {
        
        if(password.length < 8) 
            throw new Error('Password must be greater than 8 characgters');

        const user = await prisma.query.user({
             where: { email }
        });
        
        if(!user) throw new Error('Please, signup first.');

        const passwordVerified = await bcrypt.compare(password, user.password);
        if(!passwordVerified) throw new Error('Your password is wrong');

        const token = getToken(user.id);

        return { user, token };
     } 
}

export default Mutation;