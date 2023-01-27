const mongoose = require('mongoose')
require('dotenv').config('../.env');

const databaseConnect = () => {
    mongoose.connect(process.env.MONGODB_LINK_CLOUD, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Database is connected");
        }
    })
}

module.exports = databaseConnect