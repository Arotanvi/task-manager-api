const sgMail=require('@sendgrid/mail')
//const sendgridAPIKey='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'
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
// sgMail.send({
//     to:'taaru11aro@gmail.com',
//     from:'taaru11aro@gmail.com',
//     subject:'This is my first creation!',
//     text:'I hope this one actually gets to u .'
// })
const sendWelcomeEmail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'taaru11aro@gmail.com',
        subject:'Thanks for joining in',
        text:`Welcom in and let me know ${name} how u get along with the app` //with blue ticks only it will work else it wont 
    })
}
const sendCancellationEmail=(email,name)=>{
  sgMail.send({
      to:email,
      from:'taaru11aro@gmail.com',
      subject:"We are sad on ur cancellation",
      text:`Please ${name} tell us ur reason of cancellation in detail. Will be helpful for us in future`
  })
}
module.exports={
    sendWelcomeEmail,
    sendCancellationEmail
}
