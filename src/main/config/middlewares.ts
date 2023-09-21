import { Express } from "express";
import { bodyParser } from "../middlewates/body-parser";

export default (app: Express): void => {
    app.use(bodyParser)
}