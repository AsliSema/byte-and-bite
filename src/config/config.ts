import dotenv from 'dotenv';

dotenv.config();

const DB_USERNAME = process.env.DB_USERNAME || '';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || '';
const DB_CONN_STRING = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@byteandbitecluster.iz9dd9w.mongodb.net/?retryWrites=true&w=majority`;

const SERVER_PORT = process.env.SERVER_PORT || 1337;

export const config = {
    mongo: {
        url: DB_CONN_STRING,
        db_name: DB_NAME
    },
    server: {
        port: SERVER_PORT
    }
}