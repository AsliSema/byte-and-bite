import dotenv from 'dotenv';

dotenv.config();

const DB_USERNAME = process.env.DB_USERNAME || '';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || '';
const DB_CONN_STRING = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@byteandbitecluster.iz9dd9w.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

const DB_TEST_USERNAME = process.env.DB_TEST_USERNAME || '';
const DB_TEST_PASSWORD = process.env.DB_TEST_PASSWORD || '';
const DB_TEST_NAME = process.env.DB_TEST_NAME || '';
const DB_TEST_CONN_STRING = `mongodb+srv://${DB_TEST_USERNAME}:${DB_TEST_PASSWORD}@byteandbitecluster.iz9dd9w.mongodb.net/${DB_TEST_NAME}?retryWrites=true&w=majority`;

const SERVER_PORT = process.env.SERVER_PORT || 1337;

const JWT_SECRET = process.env.JWT_SECRET || '';

const CONTACT_EMAIL = process.env.CONTACT_EMAIL || '';
const CONTACT_PASSWORD = process.env.CONTACT_PASSWORD || '';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || '';

const environment = process.env.NODE_ENV || 'development';

export const config = {
    mongo: {
        devDB: {
            url: DB_CONN_STRING,
            db_name: DB_NAME,
        },
        testDB: {
            url: DB_TEST_CONN_STRING,
            db_name: DB_TEST_NAME
        }
    },
    server: {
        port: SERVER_PORT
    },
    jwt: {
        secret: JWT_SECRET
    },
    contact: {
        email: CONTACT_EMAIL,
        password: CONTACT_PASSWORD
    },
    google: {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackUrl: GOOGLE_CALLBACK_URL,
    },
    environment
}