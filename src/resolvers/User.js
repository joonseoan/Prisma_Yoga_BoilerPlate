import getUserId from '../utils/getUserId';

const User = {
    email: {
        fragment: 'fragment userId on User { id }',
        resolve({ id, email }, args, { request }, info) {

            const userId = getUserId(request, false);

            if (userId && userId === id) {
                return email;
            }

            return null;
        }
    }
    
}

export default User;