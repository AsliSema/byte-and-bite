import express, { Request, Response } from 'express';
import { config } from './config/config';
import connectToDatabase from './db/connection';
import bodyParser from 'body-parser';

const app = express();

app.use(express.json());
app.use(bodyParser.json());

connectToDatabase();

app.get('/', (req: Request, res: Response) => {
    res.send('Express TS Version');
});

app.listen(config.server.port, () => {
    console.log(`Server is running at http://localhost:${config.server.port}`);
});