import express, { Request, Response } from 'express';
import { ApiError } from './utils/apiError';
import { config } from './config/config';
import { errorHandlerMiddleware } from './utils/globalErrorHandler';

import connectToDatabase from './db/connection';
import bodyParser from 'body-parser';


const app = express();

app.use(express.json());
app.use(bodyParser.json());

connectToDatabase();

app.get('/', (req: Request, res: Response) => {
  res.send('Express TS Version');
});

// generating error for undefined routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(400, `This route: ${req.originalUrl} is not exist!`));
});

// a global error middleware that catch errors and present them in a structured way.
app.use(errorHandlerMiddleware);

app.listen(config.server.port, () => {
  console.log(`Server is running at http://localhost:${config.server.port}`);
});

// handle rejections outside express eg: database errors etc..
process.on('unhandledRejection', (reason: Error | any) => {
  console.error(`Unhandled Rejection: ${reason.message || reason}`);
});
