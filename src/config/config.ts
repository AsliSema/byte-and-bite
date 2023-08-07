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

const TEST_CUSTOMER_EMAIL = process.env.TEST_CUSTOMER_EMAIL || '';
const TEST_CUSTOMER_PASSWORD = process.env.TEST_CUSTOMER_PASSWORD || '';
const TEST_CUSTOMER_TOKEN = process.env.TEST_CUSTOMER_TOKEN || '';
const TEST_CUSTOMER_ID = process.env.TEST_CUSTOMER_ID || '';

const TEST_COOK_EMAIL = process.env.TEST_COOK_EMAIL || '';
const TEST_COOK_PASSWORD = process.env.TEST_COOK_PASSWORD || '';
const TEST_COOK_TOKEN = process.env.TEST_COOK_TOKEN || '';
const TEST_COOK_ID = process.env.TEST_COOK_ID || '';

const TEST_ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL || '';
const TEST_ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD || '';
const TEST_ADMIN_TOKEN = process.env.TEST_ADMIN_TOKEN || '';
const TEST_ADMIN_ID = process.env.TEST_ADMIN_ID || '';

const TEST_DISH_ID = process.env.TEST_DISH_ID || '';
const TEST_CART_ID = process.env.TEST_CART_ID || '';

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
    environment,
    testCustomer: {
        id: TEST_CUSTOMER_ID,
        email: TEST_CUSTOMER_EMAIL,
        password: TEST_CUSTOMER_PASSWORD,
        token: TEST_CUSTOMER_TOKEN
    },
    testCook: {
        id: TEST_COOK_ID,
        email: TEST_COOK_EMAIL,
        password: TEST_COOK_PASSWORD,
        token: TEST_COOK_TOKEN
    },
    testAdmin: {
        id: TEST_ADMIN_ID,
        email: TEST_ADMIN_EMAIL,
        password: TEST_ADMIN_PASSWORD,
        token: TEST_ADMIN_TOKEN
    },
    testDish: {
        id: TEST_DISH_ID
    },
    testCart: {
        id: TEST_CART_ID
    }

}