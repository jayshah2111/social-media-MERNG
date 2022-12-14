const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');
const mongoose = require('mongoose');

const typeDefs = require('./graphql/typeDefs');
const { MONGODB } = require('./config');
const resolvers = require('./graphql/resolvers/index'); 

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context : ({ req }) => ({ req })
});

mongoose.connect(MONGODB, { useNewUrlParser: true})
.then(() => {
    console.log("Mongodb connected successfully")
    return server.listen({ port: 5000 })
}).then(res => {
        console.log(`Server running at ${res.url}`);
 });