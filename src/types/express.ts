import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import { Address } from '../models/user';
/**
 * Custom User interface used in combination with Express Request / Response types
 */
interface User {
  user?: {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    profileImage?: string;
    password: string;
    role?: 'admin' | 'cook' | 'customer';
    isActive?: boolean;
    tokens: Array<{ token: string; signedAt: string }>;
    address: Address;
  };
}

/**
 * Combine Express types with customer User interface
 */
export type Request = Req & User;
export type Response = Res & User;
export type NextFunction = Next;
