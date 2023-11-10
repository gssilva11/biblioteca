import express, { json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
// import dotenv from 'dotenv'
// import protectRoutes from './lib/protectRoutes.js'

import cors from 'cors'

import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";

import prisma from "./database/client.js"

const app = express();

app.use(cors({
  origin: process.env.FRONT_ORIGIN,
  credentials: true
}))

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/users", usersRouter);

/////////////////////////////////////////////////

// // Protege as rotas, exigindo autenticação prévia
// app.use(protectRoutes)

import bookRouter from './routes/book.js'
app.use('/book', bookRouter)

import userRouter from './routes/user.js'
app.use('/user', userRouter)

import publisherRouter from './routes/publisher.js'
app.use('/publisher', publisherRouter)

export default app;
