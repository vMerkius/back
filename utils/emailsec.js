const Recipient = require("mailersend").Recipient;
const EmailParams = require("mailersend").EmailParams;
const MailerSend = require("mailersend");
const MAIL_API_KEY = process.env.MAIL_API_KEY;

const sendAccountActivation = async (options) => {
    const mailersend = new MailerSend({
        apiKey: MAIL_API_KEY,
    });
    
    const recipients = [new Recipient(options.email, options.name)];
    
    const personalization = [
      {
        email: options.email,
        data: {
          link: options.link,
          name: options.name
        },
      }
    ];
    
    const emailParams = new EmailParams()
        .setFrom("boostersden@boosters-den.com")
        .setFromName("Boosters Den")
        .setRecipients(recipients)
        .setSubject("Welcome to Boosters Den!")
        .setTemplateId('jy7zpl90mqrl5vx6')
        .setPersonalization(personalization);
    
    mailersend.email.send(emailParams);
};

module.exports = sendAccountActivation;