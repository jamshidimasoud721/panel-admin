const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: true
        });
        console.log(`mongodb connect : ${conn.connection.host}`)
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
}

module.exports = connectDB;