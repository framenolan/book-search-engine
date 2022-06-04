// resolvers.js: Define the query and mutation functionality to work with the Mongoose models.

// Hint: Use the functionality in the user-controller.js as a guide.

    // {$or: [{ _id: user ? user._id : params.id }, { username: params.username }],}

const { User } = require('../models')
const { AuthenticationError } = require('apollo-server-express')
const { signToken } = require('../utils/auth')


const resolvers = {
    Query: {
        // find one user
        me: async (parent, args, context) => {
            if (context.user) {
              return User.findOne({ _id: context.user._id });
            }
            throw new AuthenticationError('You need to be logged in!');
          },
    },

    Mutation: {
        login: async (parent, args) => {
            const user = await User.findOne({ $or: [{ _id: args._id }, { username: args.username }],
            });

            if (!user) {
                throw new AuthenticationError('Cannot find a user with this id!')
            }

            const correctPw = await user.isCorrectPassword(args.password);

            if (!correctPw) {
                throw new AuthenticationError('Wrong password!')
            }

            const token = signToken(user);
            return {token, user}
        },

        addUser: async (parent, args) => {
            // Accepts a username, email, and password as parameters
            const user = await User.create({
                username:args.username,
                email:args.email,
                password:args.password
            })

            const token = signToken(user)

            return { user, token }
        },

        saveBook: async (parent, {userId, input}) => {
            // Accepts a book author's array, description, title, bookId, image, and link as parameters; returns a User type. (Look into creating what's known as an input type to handle all of these parameters!)
            return await User.findOneAndUpdate(
                { _id: userId },
                { $addToSet: {savedBooks: input} },
                { new: true }
            );
        },

        removeBook: async (parent, args) => {
            // Accepts a book's bookId as a parameter
            return await User.findByIdAndDelete(args.bookId)
 
        }

    }

}

module.exports = resolvers;