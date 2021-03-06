const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const cors = require('cors');
const hpp = require('hpp');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingsRoutes');
const bookingController = require('./controllers/bookingController');

const globalErrorHandler = require('./controllers/errorController');

const AppError = require('./utils/appError');

const app = express();

app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) MIDDLEWARE

//Implement CORS
app.use(cors());

// app.use(
//   cors({
//     origin: 'https://www.natours.com/'
//   })
// );

app.options('*', cors());

// app.options('/api/v1/tours/:id', cors());

// Serving public files
app.use(express.static(path.join(__dirname, 'public')));

// Set Http secure headers
app.use(helmet());

// Dev enviroment
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate Limiter
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour!'
});

app.use('/api', limiter);

app.post('/webhook-checkout', express.raw({ type: 'application/json' }), bookingController.webhookCheckout);

// Body and cookie parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data Sanitization against XSS
app.use(xss());

// Prevent parameter polution
app.use(
  hpp({
    whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price']
  })
);

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});
// 3) ROUTES

app.use(compression());

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

// 4) START SERVER
module.exports = app;
