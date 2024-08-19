const Recipient = require("mailersend").Recipient;
const EmailParams = require("mailersend").EmailParams;
const Sender = require("mailersend").Sender;
const MailerSend = require("mailersend").MailerSend;
const MAIL_API_KEY = process.env.MAIL_API_KEY;

const sendAccountActivation = async (options) => {
    const mailerSend = new MailerSend({
        apiKey: MAIL_API_KEY,
    });

    const setFrom = new Sender('boostersden@boosters-den.com','Boosters Den');
    
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
        .setFrom(setFrom)
        .setTo(recipients)
        .setReplyTo(setFrom)
        .setPersonalization(personalization)
        .setSubject("Welcome to Boosters Den!")
        .setTemplateId('jy7zpl90mqrl5vx6')
    
    await mailerSend.email.send(emailParams);
};

const sendForgotPassword = async (options) => {
  const mailerSend = new MailerSend({
      apiKey: MAIL_API_KEY,
  });

  const setFrom = new Sender('boostersden@boosters-den.com','Boosters Den');
  
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
      .setFrom(setFrom)
      .setTo(recipients)
      .setReplyTo(setFrom)
      .setPersonalization(personalization)
      .setSubject("Forgot Your Password?")
      .setTemplateId('z3m5jgrvv9o4dpyo')
  
  await mailerSend.email.send(emailParams);
};

const sendOrderConfirmation = async (options) => {
  const mailerSend = new MailerSend({
      apiKey: MAIL_API_KEY,
  });

  const setFrom = new Sender('boostersden@boosters-den.com','Boosters Den');
  
  const recipients = [new Recipient(options.email, options.name)];
  
  const personalization = [
    {
      email: options.email,
      data: {    
        name: options.name,
        dc: options.dc,
        type: options.type,
        price: options.price
      },
    } 
  ];
        
  const emailParams = new EmailParams()
      .setFrom(setFrom)
      .setTo(recipients)
      .setReplyTo(setFrom)
      .setPersonalization(personalization)
      .setSubject("Payment Successful!")
      .setTemplateId('x2p0347kk9ylzdrn')
  
  await mailerSend.email.send(emailParams);
};

module.exports = {
  sendAccountActivation,
  sendForgotPassword,
  sendOrderConfirmation
};