const nodemailer = require('nodemailer');

// Nodemailer
const sendEmail = async (options) => {
  // 1) Create transporter ( service that will send email like "gmail","Mailgun", "mialtrap", sendGrid)
  var transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    }
  });

  // 2) Define email options (like from, to, subject, email content)
  const mailOpts = {
    from: 'E-shop App <progahmedelsayed@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Send email
  await transport.sendMail(mailOpts);
};

module.exports = sendEmail;