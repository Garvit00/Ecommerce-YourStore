import bcrypt from 'bcryptjs';

const users = [
    {
        name: 'Admin user',
        email: 'admin@email.com',
        password: bcrypt.hashSync('12345',10),
        isAdmin: true,
    },
    {
        name: 'Shraddha Kapoor',
        email: 'shraddha@email.com',
        password: bcrypt.hashSync('12345',10)
    },
    {
        name: 'katrina kaeif',
        email: 'katrina@email.com',
        password: bcrypt.hashSync('12345',10)
    },
]
export default users;