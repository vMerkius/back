const mailer = require('mailersend');

const sendEmail = async options => {

const mailerSend = new mailer.MailerSend({
  apiKey: "mlsn.09cfa6d86e554dbced470a7c8de40d02cc1c16c9c8f01ab4a34d78a1970bcc88"
});

const sentFrom = new mailer.Sender("boosters.den@trial-yzkq340o8v34d796.mlsender.net", "Boosters Den");

const recipients = [
  new mailer.Recipient(options.email, options.fullName)
];

const emailParams = new mailer.EmailParams()
  .setFrom(sentFrom)
  .setTo(recipients)
  .setReplyTo(sentFrom)
  .setSubject(options.subject)
  .setHtml(options.html)
  .setText(options.message);

await mailerSend.email.send(emailParams);
};

module.exports = sendEmail;