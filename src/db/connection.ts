import { MongoClient, ServerApiVersion } from 'mongodb';
import { config } from '../config/config';

const client = new MongoClient(config.mongo.url, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const connectToDatabase = async () => {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db(config.mongo.db_name).command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    catch (error) {
        console.log(error);
    }
    finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

export default connectToDatabase;