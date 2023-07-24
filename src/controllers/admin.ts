import { NextFunction, Request, Response } from "../types/express";
import { StatusCodes } from "http-status-codes";
import asyncHandler from "express-async-handler";
import { ApiError } from "../utils/apiError";
import User from "../models/user";