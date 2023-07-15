import { config } from '../config/config';
import mongoose, { ConnectOptions } from 'mongoose';

const connectToDatabase = async () => {
    if (config.mongo.url !== undefined) {
        try {
            await mongoose.connect(config.mongo.url, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            } as ConnectOptions);
            console.log(
                'Connected to Distribution API Database - Initial Connection'
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
