import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import { ApiError } from './utils/apiError';
import { errorHandlerMiddleware } from './utils/globalErrorHandler';
dotenv.config();

const app = express();
const port = process.env.NODE_LOCAL_PORT;

app.get('/', (req: Request, res: Response) => {
  res.send('Express TS Version');
});

// generating error for undefined routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(400, `This route: ${req.originalUrl} is not exist!`));
});

// a global error middleware that catch errors and present them in a structured way.
app.use(errorHandlerMiddleware);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// handle rejections outside express eg: database errors etc..
process.on('unhandledRejection', (reason: Error | any) => {
  console.error(`Unhandled Rejection: ${reason.message || reason}`);
});
