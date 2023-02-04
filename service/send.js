import nodeoutlook from "nodejs-nodemailer-outlook";
function sendEmail (dest,subject,message){
    
    return  nodeoutlook.sendEmail({
        auth: {
            user: process.env.sendEmail,
            pass: process.env.sendPssword
        },
        from: process.env.sendEmail,
        to: dest,
        subject,
        html: message,
        tls:{
            rejectUnauthorized:false
        },
        onError: (e) => console.log(e),
        onSuccess: (i) => console.log(i)
    },
    );
}
export default sendEmail