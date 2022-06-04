// resolvers.js: Define the query and mutation functionality to work with the Mongoose models.

// Hint: Use the functionality in the user-controller.js as a guide.

    // {$or: [{ _id: user ? user._id : params.id }, { username: params.username }],}

const { User, Auth } = require('../models')

const resolvers = {
    Query: {
        // find one user
        me: async (parent, args) => {
            if(args.userId) {
                return await User.findById(args.userId)
            } else {
                return await User.findOne(args.username)
            }
        }
    },

    Mutation: {
        login: async (parent, args) => {

            return await Auth.find()
        },

        addUser: async (parent, args) => {
            // Accepts a username, email, and password as parameters

            return await Auth.create({
                username:args.username,
                email:args.email,
                password:args.password
            })
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