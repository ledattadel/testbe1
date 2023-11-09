// const formData = require('form-data');
// const Mailgun = require('mailgun.js');
// const mailgun = new Mailgun(formData);
// const mg = mailgun.client({
// 	username: 'api',
// 	key: '',
// });


// You can see a record of this email in your logs: https://app.mailgun.com/app/logs.

// You can send up to 300 emails/day from this sandbox server.
// Next, you should add your own domain so you can send 10000 emails/month for free.

// const transporter = nodemailer.createTransport(option);

// send email
const sendEmail = async ({ to, subject, text, html, ...rest }) => {

    // const res = await transporter.verify();
    // if (res) {
    //   //config mail
    //   const mail = {
    //     //sender access
    //     from: '"Garage" <no-reply@accounts.garage.com>',
    //     //receiver access
    //     to,
    //     //subject
    //     subject,
    //     //content text
    //     text,
    //     //html
    //     html,
    //     //others
    //     ...rest,
    //   };
      



    //   //Tiến hành gửi email
    //   const info = await transporter.sendMail(mail);
    //   if (info) {
    //     return true;
    //   }
//     }
//   } catch (err) {
//     console.error("ERROR MAILER: ", err);
//     return false;
//   }
};

const headerHtmlMail = `<h1 style="color: #4c649b; font-size: 48px; border-bottom: solid 2px #ccc;padding-bottom: 10px">
<br />
    </h1>`;

const footerHtmlVerifyMail = `<h3 style="color: red">
        Chú ý: Không đưa mã này cho bất kỳ ai,
        có thể dẫn đến mất tài khoản.<br />
        Mã chỉ có hiệu lực <i>10 phút </i> từ khi bạn nhận được mail.
    </h3>
    <h1>Cảm ơn.</h1>`;

// gửi mã xác nhận
const htmlCreateAccount = (email,password) => {
  return `<div>
    ${headerHtmlMail}
    <h2 style="padding: 10px 0; margin-bottom: 10px;">
        Xin chào anh (chị),<br />
        Đây là tài khoản của anh (chị), vui lòng vào lại website để thay đổi mật khẩu<br />
        Cảm ơn vì đã ghé thăm  <3
    </h2>
    <h3 style="background: #eee;padding: 10px;">
      <i>email:<b>${email}</b></i>
      <i>password:<b>${password}</b></i>
    </h3>
  ${footerHtmlVerifyMail}
  </div>`;
};

// gửi mã đổi mật khẩu
const htmlResetPassword = (token) => {
  return `<div>
    ${headerHtmlMail}
    <h2 style="padding: 10px 0; margin-bottom: 10px;">
        Xin chào anh (chị),<br />
        Cửa hàng Shopology đã nhận được yêu cầu lấy lại mật khẩu từ quý khách.<br />
        Đừng lo lắng, hãy nhập mã này để khôi phục:
    </h2>
    <h1 style="background: #eee;padding: 10px;">
      <i><b>${token}</b></i>
    </h1>
    ${footerHtmlVerifyMail}
  </div>`;
};

// gửi thông báo đăng nhập sai quá nhiều
const htmlWarningLogin = () => {
  return `<div>
   ${headerHtmlMail}
    <h2 style="padding: 10px 0; margin-bottom: 10px;">
        Xin Chào anh (chị),<br />
        Cửa hàng nghi ngờ có ai đó đã cố gắng đăng nhập vào tài khoản của quý khách.<br />
        Nếu quý khác không nhớ mật khẩu hãy nhấn vào "Quên mật khẩu" để lấy lại mật khẩu<br/>
    </h2>
    <h1>Cảm ơn.</h1>
  </div>`;
};

const htmlCancelOrder = (fullname) => {
  return `<div>
   ${headerHtmlMail}
    <h2 style="padding: 10px 0; margin-bottom: 10px;">
        Xin Chào ${fullname},<br />
        Đơn hàng của anh chị đã được hủy thành công.<br />
        Anh chị vui lòng vào trang thông tin cá nhân => đơn hàng, để xem lại trạng thái đơn hàng.<br/>
    </h2>
    <h1>Cảm ơn.</h1>
  </div>`;
};


const htmlBill = (order, email) => {
  const addDecimal = (num) => {
    return Math.round(num * 100) / 100;
  };
  // Caculate price
  order.itemPrices = addDecimal(
    order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  return `<div style="background-color: #F6F6F6; margin: 0;padding: 0;">
    <div style="width: 80%;
    margin-right: auto;
    margin-left: auto;">
        <div style="background-color: #0d1033; padding: 10px 40px;">
            <div style="display: flex; flex-wrap: wrap;">
                <div style="width: 50%; flex: 0 0 auto;">
                    <h1 style="color: #fff; margin: 0; padding: 0;">SHOPOLOGY</h1>
                </div>
                <div style="width: 50%; flex: 0 0 auto;">
                    <div style="float: right; text-align: right;">
                        <p style="color: #fff">97 Man Thiện, Phường Hiệp Phú, Thủ Đức, TP. Hồ Chí Minh</p>
                        <p style="color: #fff">shopology.lvp@gmail.com</p>
                        <p style="color: #fff">+84 528307775</p>
                    </div>
                </div>
            </div>
        </div>

        <div style=" padding: 16px; border: 1px solid gray;">
            <div style="display: flex; flex-wrap: wrap;">
                <div style="width: 50%; flex: 0 0 auto;">
                    <h2 style="font-size: 20px; margin-bottom: 08px;">Invoice No. ${
                      order._id
                    }</h2>
                    <p style="color: #262626; margin-bottom: 05px;">Tracking No. Shopology </p>
                    <p style="color: #262626; margin-bottom: 05px;">Order Date: ${
                      order.createdAt
                    } </p>
                    <p style="color: #262626; margin-bottom: 05px;">Email Address: ${email} </p>
                </div>
                <div style="width: 50%; flex: 0 0 auto;">
                    <p style="color: #262626; margin-bottom: 05px;">Full Name: ${
                      order.shippingAddress.fullname
                    } </p>
                    <p style="color: #262626; margin-bottom: 05px;">Address: ${
                      order.shippingAddress.address +
                      ", " +
                      order.shippingAddress.ward +
                      ", " +
                      order.shippingAddress.district + 
                      ", " +
                      order.shippingAddress.province
                    } </p>
                    <p style="color: #262626; margin-bottom: 05px;">Phone Number: ${
                      order.shippingAddress.phone
                    } </p>
                </div>
            </div>
        </div>

        <div style=" padding: 16px; border: 1px solid gray;">
            <h3 style="font-size: 20px; margin-bottom: 08px;">Ordered Items</h3>
            <br>
            <table style="box-shadow: 0px 0px 5px 0.5px gray;  background-color: #fff; width: 100%; border-collapse: collapse">
                <thead>
                    <tr style=" border: 1px solid #111; background-color: #f2f2f2;">
                        <th style="border: 1px solid #dee2e6;">Product</th>
                        <th style="width: 20%; border: 1px solid #dee2e6;">Price</th>
                        <th style="width: 20%; border: 1px solid #dee2e6;">Quantity</th>
                        <th style="width: 20%; border: 1px solid #dee2e6;">Grandtotal</th>
                    </tr>
                </thead>
                <tbody>
                ${order.orderItems.map(
                  (item, index) =>
                    `<tr key={${index}}>
                      <td style="border: 1px solid #dee2e6; vertical-align: middle !important; text-align: center; padding-top: 08px; padding-bottom: 08px;">${
                        item.name
                      }</td>
                      <td style="border: 1px solid #dee2e6; vertical-align: middle !important; text-align: center; padding-top: 08px; padding-bottom: 08px;">${
                        item.price
                      }</td>
                      <td style="border: 1px solid #dee2e6; vertical-align: middle !important; text-align: center; padding-top: 08px; padding-bottom: 08px;">${
                        item.qty
                      }</td>
                      <td style="border: 1px solid #dee2e6; vertical-align: middle !important; text-align: center; padding-top: 08px; padding-bottom: 08px;">${
                        item.price * item.qty
                      }</td>
                  </tr>`
                )}
                    <tr>
                        <td colspan="3" style="text-align: end; border: 1px solid #dee2e6; vertical-align: middle !important; text-align: center; padding-top: 08px; padding-bottom: 08px;">Sub Total</td>
                        <td style="border: 1px solid #dee2e6; vertical-align: middle !important; text-align: center; padding-top: 08px; padding-bottom: 08px;">${
                          order.itemPrices
                        }</td>
                    </tr>
                    <tr>
                        <td colspan="3" style="text-align: end; border: 1px solid #dee2e6; vertical-align: middle !important; text-align: center; padding-top: 08px; padding-bottom: 08px;">Shipping</td>
                        <td style="border: 1px solid #dee2e6; vertical-align: middle !important; text-align: center; padding-top: 08px; padding-bottom: 08px;">${
                          order.shippingPrice
                        }</td>
                    </tr>
                    <tr>
                        <td colspan="3" style="text-align: end; border: 1px solid #dee2e6; vertical-align: middle !important; text-align: center; padding-top: 08px; padding-bottom: 08px;">Tax Total</td>
                        <td style="border: 1px solid #dee2e6; vertical-align: middle !important; text-align: center;" padding-top: 08px; padding-bottom: 08px;>${
                          order.taxPrice
                        }</td>
                    </tr>
                    <tr>
                        <td colspan="3" style="text-align: end; border: 1px solid #dee2e6; vertical-align: middle !important; text-align: center; padding-top: 08px; padding-bottom: 08px;">Grand Total</td>
                        <td style="border: 1px solid #dee2e6; vertical-align: middle !important; text-align: center; padding-top: 08px; padding-bottom: 08px;">${
                          order.totalPrice
                        }</td>
                    </tr>
                </tbody>
            </table>
            <br>
            <h3 style="font-size: 20px; margin-bottom: 08px;">Payment Method: ${
              order.paymentMethod
            }</h3>
        </div>

        <div style=" padding: 16px; border: 1px solid gray;">
            <p>&copy; Copyright 2021 - Shopology. All rights reserved. 
                <a href="http://localhost:3000/" style="float: right">www.shopology.com</a>
            </p>
        </div>      
    </div>      
  </div>`.replace(">,<", "><");
};

module.exports = {
  sendEmail,
  htmlCreateAccount,
  htmlResetPassword,
  htmlWarningLogin,
  htmlBill,
  htmlCancelOrder,
};