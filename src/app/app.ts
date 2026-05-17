import express, { Application, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import notFound from './middleware/notFound';
import { globalError } from './middleware/globalError';
import router from './routes/routes';

const app:Application = express();

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", router)

app.get("/", (req: Request, res: Response) => {
    res.send("server is running");
});

app.use(notFound);
app.use(globalError);

export default app;
