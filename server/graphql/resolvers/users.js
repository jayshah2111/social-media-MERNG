const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const { validateRegisterInput, validateLoginInput  } = require('../utils/validators.utils');
const { SECRET_KEY } = require('./../../config');
const User = require('../../models/userModel');

function generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username
      },
      SECRET_KEY,
      { expiresIn: '1h' }
    );
}

module.exports = {
    Mutation: {
        async login(_, { username, password }) {
            const { errors, valid } = validateLoginInput(username, password);
      
            if (!valid) {
              throw new UserInputError('Errors', { errors });
            }
      
            const user = await User.findOne({ username });
      
            if (!user) {
              errors.general = 'User not found';
              throw new UserInputError('User not found', { errors });
            }
      
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
              errors.general = 'Wrong crendetials';
              throw new UserInputError('Wrong crendetials', { errors });
            }
      
            const token = generateToken(user);
      
            return {
              ...user._doc,
              id: user._id,
              token
            };
        },
        
        async register( 
            _,
            { 
                registerInput: { username, email, password, confirmPassword}
            }, 
            context, 
            info
        ){
            const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);
            if(!valid){
                throw new UserInputError('Errors', { errors });
            }
            
            const user = await User.findOne({ username });
            if(user){
                 throw new UserInputError('Username is taken', {
                    errors: {
                        username: 'This username is already taken'
                    }
                 });
            }

            password = await bcrypt.hash(password, 11);

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            });

            const res = await newUser.save();

            const token = jwt.sign(
                { 
                    id: res.id,
                    email: res.email,
                    username: res.username
                }, 
                SECRET_KEY, 
                { expiresIn : '1h' }
            );

            return {
                ...res._doc,
                id: res._id,
                token
            };
        }
    }
};