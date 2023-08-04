import express, { Request, Response, NextFunction } from 'express';
import { ApiError } from './utils/apiError';
import { config } from './config/config';
import { errorHandlerMiddleware } from './utils/globalErrorHandler';
import { StatusCodes } from 'http-status-codes';
import authRoutes from './routes/auth';
import dishRoutes from './routes/dish';
import cartRoutes from './routes/cart';
import orderRoutes from './routes/order';
import adminRoutes from './routes/admin';
import contactUsRoute from './routes/contactUs';
import pagesRoutes from './routes/pages';
import googleAuth from './routes/googleAuth';

import connectToDatabase from './db/connection';
import bodyParser from 'body-parser';

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './utils/swagger';
import path from 'path';

import "./config/passport";

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.use(express.json());
app.use(bodyParser.json());




// Pages Routes
app.use('/', pagesRoutes);
app.use('/auth', googleAuth);

// API Routes
app.use('/api/contact-us/', contactUsRoute);
app.use('/api/users/', authRoutes);
app.use('/api/dish/', dishRoutes);
app.use('/api/cart/', cartRoutes);
app.use('/api/order/', orderRoutes);
app.use('/api/admin/', adminRoutes);
app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true })
);
app.get('/api/docs.json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

connectToDatabase();

// generating error for undefined routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(
    new ApiError(
      StatusCodes.BAD_REQUEST,
      `This route: ${req.originalUrl} is not exist!`
    )
  );
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
