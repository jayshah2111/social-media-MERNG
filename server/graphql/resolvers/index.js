const postResolvers = require('./posts');
const userResolvers = require('./users');
const commentsResolvers = require('./comments');

module.exports = {
    Post:{
        likeCount(parent){
            console.log(parent);
            return parent.likes.length
        },
        commentsCount: (parent) => parent.comments.length,
    },
    Query: {
        ...postResolvers.Query 
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...postResolvers.Mutation,
        ...commentsResolvers.Mutation,
    }
}