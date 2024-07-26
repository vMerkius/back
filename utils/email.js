const mailer = require('mailersend');
const MAIL_API_KEY = process.env.MAIL_API_KEY;

const sendEmail = async (options) => {
  const mailerSend = new mailer.MailerSend({
    apiKey: MAIL_API_KEY,
  });

  const sentFrom = new mailer.Sender(
    'boostersden@boosters-den.com',
    'Boosters Den'
  );

  const recipients = [new mailer.Recipient(options.email, options.fullName)];

  const emailParams = new mailer.EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject(options.subject)
    .setHtml(options.html)
    .setText(options.message);

  try {
    await mailerSend.email.send(emailParams);
  } catch (err) {
    console.log("Error sending email", err);
  }
};

module.exports = sendEmail;