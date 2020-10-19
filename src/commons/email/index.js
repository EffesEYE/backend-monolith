import mailer from 'nodemailer';

const transporter = mailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'effeseyeng@gmail.com',
    pass: process.env.EMAIL_PSWD
  }
});

const getMailOptions = ({ to, subject = 'EffesEYE', content }) => ({
  to,
  subject,
  html: content,
  from: '"Evie from EffesEYE" <effeseyeng@gmail.com>'
});

export const sendEMail = ({ to, subject, content }) => {
  const options = getMailOptions({ to, subject, content });
  transporter.sendMail(options, (err) => {
    if (err) console.error('Error sending email', err);
  });
};

export const sendWelcomeEmail = ({ to, firstname }) => {
  let name = firstname.toLowerCase();
  name = `${name.charAt(0).toUpperCase()}${name.substring(1)}`;
  const content = `
    <h3>Hi ${name}</h3>
    <h4>Welcome to EffesEYE</h4>
    <br />
    <p>Thank you for joining EffesEYE, the winning mobile bills payment platform.</p>
    <h5>Evie, for the EffesEye team.</h5>
  `;

  return sendEMail({ to, content, subject: '[Welcome] EffesEYE' });
};
