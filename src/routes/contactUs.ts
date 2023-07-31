import express from 'express';
import { contactUs } from '../controllers/contactUs';
import { contactValidator } from '../utils/validators/contactValidator';

const router = express.Router();

/**
 * @swagger
 * /api/contact-us:
 *   post:
 *     summary: Contact us route for all users.
 *     description: User can send an email to the admin email address (bytebite60@gmail.com).
 *     tags:
 *       - Contact
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: Sender fullname.
 *                 default: 'Test Username'
 *               email:
 *                 type: string
 *                 description: Sender's email address.
 *                 default: 'test@gmail.com'
 *               phone:
 *                 type: string
 *                 description: optional property, it only accept TR phone numbers.
 *                 default: '5534564323'
 *               message:
 *                 type: string
 *                 description: Sender's message, max 300 characters.
 *                 default: 'Lorem ipsum 4Lorem ipsum 4Lorem ipsum 4Lorem ipsum 4Lorem ipsum 4Lorem ipsum 4Lorem ipsum 4Lorem ipsum 4Lorem ipsum 4Lorem ipsum 4'
 *             required:
 *               - fullName
 *               - email
 *               - message
 *     responses:
 *       '200':
 *         description: Success.
 *       '400':
 *         description: Bad request.
 *       '500':
 *         description: Internal Server Error.
 */
router.route('/').post(contactValidator, contactUs);

export default router;
