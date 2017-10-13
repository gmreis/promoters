const mongoose = require('mongoose')
mongoose.Promise = require('bluebird');

//mongoose.set('debug', true)

const host = process.env.DATABASE_HOST || 'localhost';
const port = process.env.DATABASE_PORT || '27017';
const db = process.env.DATABASE_DB || 'promoters';

var auth = '';
if(process.env.DATABASE_USER && process.env.DATABASE_PASS)
    auth = `${process.env.DATABASE_USER}:${process.env.DATABASE_PASS}@`;

const connection = mongoose.connect(`mongodb://${auth}${host}:${port}/${db}`, {
    useMongoClient: true,
});

module.exports = connection