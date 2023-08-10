import { config } from '../config/config';
import mongoose, { ConnectOptions } from 'mongoose';



const connectToDatabase = async () => {
    let mongoURI;

    if (config.environment === 'development') {
        mongoURI = config.mongo.devDB.url;
    } else if (config.environment === 'test') {
        mongoURI = config.mongo.testDB.url;
    }
    console.log('1: trying to connect to database with connStr:', mongoURI);
    if (mongoURI !== undefined) {
        try {
            console.log('2: trying to connect to database with connStr:', mongoURI);
            await mongoose.connect(mongoURI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            } as ConnectOptions);
            console.log(
                'Connected to Distribution API Database - Initial Connection',
                mongoURI
            );
        } catch (err) {
            console.log(
                'Initial Distribution API Database connection error occured -',
                err
            );
        }
    }
};

export default connectToDatabase;
