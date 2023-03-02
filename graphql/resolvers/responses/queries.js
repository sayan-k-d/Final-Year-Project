import { User } from "../../../db/models/index.js";
import JWT from "jsonwebtoken";
import { config } from "dotenv";
config();
const { sign } = JWT;
const responseQueries = {};
export default responseQueries;
