const mongoose = require('mongoose')
mongoose.Promise = require('bluebird');

const host = 'localhost'
const port = 27017
const db = 'promoters'

const connection = mongoose.connect(`mongodb://${host}:${port}/${db}`, {
    useMongoClient: true,
})

/*
connection.on('connected', function(err, result) {
    if(err)
        console.error('connected:', err);
    else
        console.log('connected');
});
*/

module.exports = connection