const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'trongdat2105@gmail.com', // your email
    pass: 'vibsemlhjmywabon' // your email password
  }
});

function sendMail(mailOptions) {
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}


const headerHtmlMail = `<h1 style="color: #4c649b; font-size: 48px; border-bottom: solid 2px #ccc;padding-bottom: 10px">
Garage Ptit<br />
    </h1>`;

const footerHtmlVerifyMail = `<h3 style="color: red">
        Chú ý: Không đưa tài khoản này cho bất kỳ ai,
        có thể dẫn đến mất tài khoản.<br />
        Trân trọng,<br />
    </h3>
    <h1>Cảm ơn.</h1>`;

// gửi mã xác nhận
const htmlSignupAccount = (phoneNumber,password) => {
  return `<div>
    ${headerHtmlMail}
    <h2 style="padding: 10px 0; margin-bottom: 10px;">
        Xin chào anh (chị),<br />
        Đây là tài khoản của anh chị:<br />
        tài khoản: <b>${phoneNumber}</b><br />
        mật khẩu: <b>${password}</b><br />
    </h2>
  ${footerHtmlVerifyMail}
  </div>`;
};



module.exports = {
  sendMail,
  htmlSignupAccount
};
