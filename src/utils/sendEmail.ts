import nodemailer from 'nodemailer';
import { config } from '../config/config';

type contactOptions = {
  email: string;
  subject: string;
  message: string;
  fullName: string;
  phone: string;
};
type orderOptions = {
  subject: string;
  CookEmail: string | undefined;
  customerName: string;
  customerEmail: string;
  deliveryAddress: string;
  totalOrderPrice: number;
  dishes: string;
};
type mailOpt = {
  from: string;
  to: string | undefined;
  subject: string;
  html: string;
};

const sendEmailContact = async (options: contactOptions) => {
  const transporter = nodemailer.createTransport({
    // @ts-ignore:next-line
    host: 'smtp.gmail.com',
    port: 465,
    domain: 'gmail.com',
    service: 'gmail',
    auth: {
      user: config.contact.email,
      pass: config.contact.password,
    },
  });

  const mailOpts: mailOpt = {
    from: options.email,
    to: config.contact.email,
    subject: options.subject,
    html: `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Question from contact form</title>
      </head>
    
      <body>
        <!-- Header with the image taking full width -->
        <header style="text-align: center;">
          <img
            src="https://www.namogoo.com/wp-content/uploads/2021/04/5-types-of-customers-blog-1200x500-new.png"
            alt="Header Image"
            style="width: 100vw; max-width: 100%; height: 300px; display: block;"
          />
        </header>
    
        <main>
          <strong style="font-size: 24px;">🟨 Sender information</strong>
        </main>
        <hr style="border: 1px dashed #ccc;" />
        <p style="font-size: 14px;">Email: ${options.email}</p>
        <p style="font-size: 14px;">Name: ${options.fullName}</p>
        <p style="font-size: 14px;">Phone: ${options.phone}</p>
        <div>
          <p style="font-size: 24px;"><strong>🟨 Message</strong></p>
          <hr style="border: 1px dashed #ccc;" />
          <p style="font-size: 14px;">${options.message}</p>
        </div>
      </body>
    </html>
        `,
  };

  await transporter.sendMail(mailOpts);
};

const sendEmailOrder = async (options: orderOptions) => {
  const transporter = nodemailer.createTransport({
    // @ts-ignore:next-line
    host: 'smtp.gmail.com',
    port: 465,
    domain: 'gmail.com',
    service: 'gmail',
    auth: {
      user: config.contact.email,
      pass: config.contact.password,
    },
  });

  const mailOpts: mailOpt = {
    from: config.contact.email,
    to: options.CookEmail,
    subject: options.subject,
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Question from contact form</title>
        </head>
      
        <body>
          <!-- Header with the image taking full width -->
          <header style="text-align: center;">
            <img
              src="https://img.huffingtonpost.com/asset/5e7a384d2200005500b3a99d.jpeg"
              alt="Header Image"
              style="width: 100vw; max-width: 100%; height: 350px; display: block; opacity: 0.8"
            />
          </header>
      
          <main>
          <br>
            <strong style="font-size: 24px;">✅ Order Details</strong>
          </main>
          <hr style="border: 1px dashed #ccc;" />
          <p style="font-size: 14px;"><b>Customer Name:</b> ${options.customerName}</p>
          <p style="font-size: 14px;"><b>Customer Email:</b> ${options.customerEmail}</p>
          <p style="font-size: 14px;"><b>Delivery Address:</b> ${options.deliveryAddress}</p>
          <p style="font-size: 14px;"><b>Total Price:</b> ${options.totalOrderPrice} ₺</p>
          <p style="font-size: 14px;"><b>Ordered Dishes:</b></p>
          <p style="font-size: 14px;">${options.dishes}</p>
        </body>
      </html>
          `,
  };

  await transporter.sendMail(mailOpts);
};

export { sendEmailContact, sendEmailOrder };
