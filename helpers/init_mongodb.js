const mongoose = require('mongoose');

mongoose.set('debug', true);
mongoose.set('strictQuery', true);

mongoose.connect(`${process.env.MONGO_URI}/${process.env.MONGO_DB_NAME}`, { serverSelectionTimeoutMS: 2000 });
mongoose.connection.on('connected', () => console.log('connected to mongodb'));
mongoose.connection.on('error', (err) => console.log(err));
