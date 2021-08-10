import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes";

dotenv.config();
const app = express();
const globalErrorHandler = (err: any, req: any, res: any, next: any) => {
    res.status(500).json({
        status: "error",
        message: err.message
    });
}

const PORT: number = parseInt(process.env.PORT as string, 10);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(routes);
app.use(globalErrorHandler);

app.listen(PORT, () => { console.log('listening on port ' + PORT) });