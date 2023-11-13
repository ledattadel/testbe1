import { getRepository } from 'typeorm';
import { AppDataSource } from '../data-source';
import {parseDateStringToDate, spitDateFromString, compareDateStrings, compare2DateBetweenStrings, generateRandomPassword} from '../utils/support'
import { Customer, PriceQuote, Receipt } from '../model/index';
import messages from '../messageResponse.js'
import {sendMail, htmlSignupAccount} from '../utils/mail.config.js'
import { log } from 'console';
import { isEmptyObject, error, success } from '../util';

class CustomerService {

  

  async getTotalCustomersByTimeRange(req, res) {
    try {
      const { startDate, endDate } = req.query; 
    

    const receipts = await AppDataSource.getRepository(Customer).find({ 
      where: { isActive: true } 
    });
    
    const filteredData = receipts.filter(item => {    
      return compare2DateBetweenStrings(startDate,spitDateFromString(item.TimeCreate),endDate)
    });


      return res.json({total: filteredData.length, filteredData});
    } catch (error) {
      return res.status(500).json({ error: messages.internalServerError + error});
    }
  }
  

  // GET_ALL
  async getAll(_, res) {
    try {
      const customers = await AppDataSource.getRepository(Customer).find({ where: { isActive: true } });
      return res.json(customers.reverse());
    } catch (error) {
      return res.status(500).json({ error: messages.internalServerError });
    }
  }


  
 // API/CUSTOMER   post
  async create(req, res) {
    const customerRepo = AppDataSource.getRepository(Customer);
    const { name, email, phoneNumber, TimeCreate } = req.body;
    if (!name || !phoneNumber || !TimeCreate || !email) {
      return res.status(400).json({
        code: 400,
        message: '"Thông tin khách hàng không đầy đủ"',
      });
    }

    try {
      const existingCustomerPhoneNumber = await customerRepo.findOne({
        where: { phoneNumber },
      });

      const existingCustomerEmail = await customerRepo.findOne({
        where: { email },
      });


      if (existingCustomerPhoneNumber ) {
        return res.status(400).json({
          code: 400,
          message: 'Số điện thoại khách hàng đã tồn tại',
        });
      }

      if (existingCustomerEmail) {
        return res.status(400).json({
          code: 400,
          message: 'Email đã được sử dụng bởi khách hàng khác',
        });
      }



      const password = generateRandomPassword(8);
      const customer = new Customer();
      customer.TimeCreate = TimeCreate;
      customer.name = name;
      customer.email = email || null;
      customer.phoneNumber = phoneNumber;
      customer.isActive = true;
      customer.password = customer.createPassword(password);
        const mail = {
          to: email,
          subject: 'Provide account for customer',
          text: '',
          html: htmlSignupAccount(phoneNumber, password),
        };

      try {
        const result = sendMail(mail);
      } catch (error) {
        return res.status(400).json({ message: 'Send verify code failed !' });
      }  
      await customerRepo.save(customer);


    
      return res.status(200).json({ message: messages.createCustomerSuccessful });
    } catch (error) {
      return res.status(500).json({ error: 'Có lỗi xảy ra trong quá trình xử lý' + error});
    }
  }
// GET_BY_ID
async getById(req, res) {
  try {
    const customerId = req.params.id;
    const customer = await AppDataSource.getRepository(Customer).findOne({where:{CustomerID: customerId, isActive: true}});

    if (!customer) {
      return res.status(404).json({ message: messages.notFound});
    }

    return res.json(customer);
  } catch (error) {
    return res.status(500).json({ error: messages.internalServerError});
  }
}

 // API/CUSTOMER/PHONE/:PHONENUMBER
 async getByPhoneNumber(req, res) {
  try {
    const phoneNumber = req.params.phoneNumber;
    const customer = await AppDataSource.getRepository(Customer).findOne({ where: { phoneNumber: phoneNumber,  isActive: true } });

    if (!customer) {
      return res.status(404).json({ message: '"Không tìm thấy khách hàng"' });
    }

    return res.json(customer);
  } catch (error) {
    return res.status(500).json({ code: 500, message: "Có lỗi xảy ra trong quá trình xử lý", error: error });
  }
 
}


  // UPDATE
  async updateCustomer(req, res) {
    const customerRepo = AppDataSource.getRepository(Customer);
    const customerId = req.params.id;
    const { name, email, phoneNumber } = req.body;
    
    try {
      const customer = await customerRepo.findOne({ where: { CustomerID: customerId } });

      if (!customer) {
        return res.status(404).json({ message: messages.notFound });
      }

      customer.name = name || customer.name;
      customer.email = email || customer.email;
      customer.phoneNumber = phoneNumber || customer.phoneNumber;

      await customerRepo.save(customer);
      return res.status(200).json({ message: messages.updateCustomerSuccessful });
    } catch (error) {
      return res.status(500).json({ error: messages.internalServerError});
    }
  }

  async deleteCustomer(req, res) {
    const customerRepo =  AppDataSource.getRepository(Customer);
    const customerId = req.params.id;

    try {
      const customer = await customerRepo.findOne({ where: { CustomerID: customerId,  isActive: true } });

      if (!customer) {
        return res.status(404).json({ message: messages.notFound });
      }

      customer.isActive = false;
      await customerRepo.save(customer);
      return res.status(200).json({ message: messages.deleteCustomerSuccessful });
    } catch (error) {
      return res.status(500).json({ error: messages.internalServerError });
    }
  }

  async signIn(req, res) {
    if (isEmptyObject(req.body)) {
      return  res.status(500).json({
        message: 'Empty data',
      });
    }

    const { phoneNumber, password } = req.body;

    if (!password && !phoneNumber) {
      return res.status(500).json({
        message: 'Empty data',
      });
    }
    if (!phoneNumber) {
      return res.status(500).json({
        message: 'Empty phone number',
      });
    }
    if (!password) {
      return res.status(500).json({
        message: 'Empty password',
      });
    }

    

    const account = await AppDataSource.getRepository(Customer).findOne({
      where: {
        phoneNumber: phoneNumber,
      },
    });
    if (!account) {
      return res.status(500).json({
        message: messages.accountNotFoundWhenSignIn,
      });
    }
    const validPassword = account.comparePassword(password);
    const getAllReceipts = await AppDataSource.getRepository(Receipt).find({ where: { CustomerID: account.CustomerID } });
    let priceQuoteArr = [];
    for (const receipt of getAllReceipts) {
      const priceQuote = await AppDataSource.getRepository(PriceQuote).findOne({ where: { ReceiptID: receipt.ReceiptID } });
 
    if (priceQuote) {
      const priceQuoteFound = await AppDataSource.getRepository(PriceQuote).findOne({
        where: { QuoteID: priceQuote.QuoteID, isActive: true },
        relations: [
          "staff",
          "receipt.vehicle",
          "receipt.customer",
          "vehicleStatusReceipts.vehicleStatus",

          "vehicleStatusReceipts.pqServiceDetails.service",

          "vehicleStatusReceipts.pqProductDetails.productDetail.product.brand",
          "repairOrder",
        ],
      });
      priceQuoteArr.push(priceQuoteFound);
    }
    }


    if (!validPassword) {
      return res.status(500).json({
        message: messages.wrongPasswordWhenSignIn,
      });
    }else{
      return res.status(200).json({
        message: { info: account , priceQuote: priceQuoteArr},
      });
    }
    

}

  async getAllPriceQuoteByCustomer(req, res) {

    const CustomerId = req.params.id;

    const getAllReceipts = await AppDataSource.getRepository(Receipt).find({ where: { CustomerID: CustomerId } });
    let priceQuoteArr = [];
    for (const receipt of getAllReceipts) {
      const priceQuote = await AppDataSource.getRepository(PriceQuote).findOne({ where: { ReceiptID: receipt.ReceiptID } });
 
    if (priceQuote) {
      const priceQuoteFound = await AppDataSource.getRepository(PriceQuote).findOne({
        where: { QuoteID: priceQuote.QuoteID, isActive: true },
        relations: [
          "staff",
          "receipt.vehicle",
          "receipt.customer",
          "vehicleStatusReceipts.vehicleStatus",

          "vehicleStatusReceipts.pqServiceDetails.service",

          "vehicleStatusReceipts.pqProductDetails.productDetail.product.brand",
          "repairOrder",
        ],
      });
      priceQuoteArr.push(priceQuoteFound);
    }
    }


      return res.status(200).json({
        message: {  priceQuote: priceQuoteArr},
      })
    
  }


}

export default new CustomerService();
