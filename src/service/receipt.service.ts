import { AppDataSource } from '../data-source';
import { Receipt , Staff, Customer, Vehicle, Brand, VehicleStatus, VehicleStatusReceipt, PriceQuote} from '../model'; // Đảm bảo bạn import model `Receipt`
import messages from '../messageResponse.js';
import {parseDateStringToDate, spitDateFromString, compareDateStrings, compare2DateBetweenStrings} from '../utils/support'
class ReceiptService {

  

  async getTotalReceiptsByTimeRange(req, res) {
    try {
      const { startDate, endDate } = req.query; 
    

    const receipts = await AppDataSource.getRepository(Receipt).find({ 
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
  

  async getAll(_, res) {
    try {
      const receipts = await AppDataSource.getRepository(Receipt).find({ 
        where: { isActive: true } , 
        relations:[
          'staff',
          'customer',
          'vehicle',
          'vehicleStatusReceipts.vehicleStatus'
        ]
      });
      return res.json(receipts.reverse());
    } catch (error) {
      return res.status(500).json({ error: messages.internalServerError });
    }
  }

  async getById(req, res) {
    try {
      const receiptId = req.params.id;
      const receipt = await AppDataSource.getRepository(Receipt).findOne({ where: { ReceiptID: receiptId, isActive: true } });

      if (!receipt) {
        return res.status(404).json({ message: messages.notFound });
      }

      return res.json(receipt);
    } catch (error) {
      return res.status(500).json({ error: messages.internalServerError });
    }
  }

  async create(req, res) {
    try {

        const receiptRepo = AppDataSource.getRepository(Receipt);
        const staffRepo = AppDataSource.getRepository(Staff);
        const customerRepo =  AppDataSource.getRepository(Customer);
        const vehicleRepo = AppDataSource.getRepository(Vehicle)
        const brandRepo = AppDataSource.getRepository(Brand);
        const vehicleStatusRepo = AppDataSource.getRepository(VehicleStatus);
        const VehicleStatusReceiptRepo = AppDataSource.getRepository(VehicleStatusReceipt);

      const {timeCreate, staffId, customerPhoneNumber, customerName, email, NumberPlateVehicle, TypeVehicle, ColorVehicle, EngineNumberVehicle, ChassisNumberVehicle, BrandNameVehicle , vehicleStatus ,Note 
      }= req.body;
      
      const requiredFields = ['timeCreate', 'staffId', 'customerPhoneNumber', 'customerName', 'email', 'NumberPlateVehicle', 'TypeVehicle', 'ColorVehicle', 'EngineNumberVehicle', 'ChassisNumberVehicle', 'BrandNameVehicle', 'vehicleStatus'];
      const missingFields = requiredFields.filter(field => !req.body[field]);
      if (missingFields.length > 0) {
        return res.status(400).json({
          code: 400,
          message: `Missing required fields: ${missingFields.join(', ')}`,
        });
      }

    //   const staffQuery = await staffRepo.findOne({where: { id: staffId }})
      const customerQuery = await customerRepo.findOne({where: { phoneNumber: customerPhoneNumber }})
      const vehicleQuery = await vehicleRepo.findOne({where: { NumberPlate: NumberPlateVehicle }})
      
      let newCustomer = customerQuery;
      let newVehicle = vehicleQuery;

      if (!customerQuery) {
        const customer = new Customer();
        customer.TimeCreate = timeCreate
        customer.name = customerName;
        customer.email = email || null;
        customer.phoneNumber = customerPhoneNumber;
        customer.isActive = true;
  
        await customerRepo.save(customer);
        newCustomer = await customerRepo.findOne({where: { phoneNumber: customer.phoneNumber }})

      }

      if (!vehicleQuery) {

        const vehicle = new Vehicle();
        vehicle.NumberPlate = NumberPlateVehicle; 
        vehicle.Type = TypeVehicle;
        vehicle.Color = ColorVehicle;
        vehicle.EngineNumber = EngineNumberVehicle ;
        vehicle.ChassisNumber = ChassisNumberVehicle ;
        vehicle.TimeCreate = timeCreate;

        const existBrand = await brandRepo.findOne({
            where:{BrandName: BrandNameVehicle}
        })
        

          let brandId = null;
          let newBrand = new Brand();
          if (existBrand) {
            brandId = existBrand.BrandID;
          }else{
           
            newBrand.BrandName = BrandNameVehicle;
            newBrand.isActive = true;
            brandRepo.save(newBrand);
          }
    
        vehicle.BrandId=newBrand.BrandID;
        vehicle.isActive = true;
  
        await vehicleRepo.save(vehicle);
        newVehicle = await vehicleRepo.findOne({where: { NumberPlate: NumberPlateVehicle}})

      }

      const receipt = new Receipt();
      receipt.TimeCreate = timeCreate;
      receipt.Note = Note;
      receipt.StaffID = staffId;
      receipt.CustomerID = newCustomer.CustomerID;
      receipt.VehicleID = newVehicle.VehicleID;
      receipt.isActive = true;
      await receiptRepo.save(receipt);

      if (vehicleStatus) {
        for (let index = 0; index < vehicleStatus.length; index++) {
          const vehicleStatusReceipt = new VehicleStatusReceipt();
          const vehicleStatusExist = await vehicleStatusRepo.findOne({ where: { ID: vehicleStatus[index].id } });
          if (!vehicleStatusExist) {
            return res.status(500).json({
              error: 'Vehicle status not found',
            });
          }
          vehicleStatusReceipt.Condition = vehicleStatus[index].condition;
          vehicleStatusReceipt.IsRepairDone = false;
          vehicleStatusReceipt.isTranferToPriceQuote = false;
          vehicleStatusReceipt.TimeCreate = timeCreate;
          vehicleStatusReceipt.VehicleStatusID = vehicleStatusExist.ID;
          vehicleStatusReceipt.ReceiptID=receipt.ReceiptID;
          vehicleStatusReceipt.RepairOrderID = null;
          VehicleStatusReceiptRepo.save(vehicleStatusReceipt);  
        }
      }


      return res.status(201).json({
        message: messages.createReceiptSuccessful,
      });
    } catch (error) {
      return res.status(500).json({
        error: messages.internalServerError +  error,
      });
    }
  }

  async update(req, res) {
    try {
      const receiptId = req.params.id;
      const {
        Editor,
        TimeUpdate,
        VehicleStatus,
        Note
      } = req.body;
  
      if (
        !Editor ||
        !TimeUpdate ||
        !VehicleStatus
      ) {
        return res.status(400).json({
          code: 400,
          message: messages.missingReceiptFields,
        });
      }
  
      const receiptRepo = AppDataSource.getRepository(Receipt);
      const staffRepo = AppDataSource.getRepository(Staff);
      const customerRepo = AppDataSource.getRepository(Customer);
      const vehicleRepo = AppDataSource.getRepository(Vehicle);
      const brandRepo = AppDataSource.getRepository(Brand);
      const vehicleStatusRepo = AppDataSource.getRepository(VehicleStatus);
      const VehicleStatusReceiptRepo = AppDataSource.getRepository(VehicleStatusReceipt);
  
      const receipt = await receiptRepo.findOne({ where: { ReceiptID: receiptId } });
  
      if (!receipt) {
        return res.status(404).json({ message: messages.notFound });
      }
  
      const findEditor = await staffRepo.findOne({ where: { id: Editor } });
  
      if (!findEditor) {
        return res.status(404).json({ message: messages.staffNotFound });
      }
  
     
  
      try {
        receipt.TimeUpdate = TimeUpdate;
        receipt.Note = Note || receipt.Note;
        receipt.editor = Editor;
      
        const existingPairs = [];

        for (let index = 0; index < VehicleStatus.length; index++) {
          const vehicleStatus = VehicleStatus[index];
        
          // Kiểm tra xem cặp VehicleStatusID và ReceiptID đã xuất hiện chưa
          const isDuplicatePair = existingPairs.some(
            (pair) => pair.VehicleStatusID === vehicleStatus.id && pair.ReceiptID === receiptId
          );
        
          if (!isDuplicatePair) {
            // Nếu chưa xuất hiện, thêm vào mảng existingPairs và thực hiện logic khác
            existingPairs.push({ VehicleStatusID: vehicleStatus.id, ReceiptID: receiptId });
        
            const vehicleStatusReceipt = new VehicleStatusReceipt();
          
            try {
              vehicleStatusReceipt.Condition = vehicleStatus.Condition;
              vehicleStatusReceipt.IsRepairDone = false;
              vehicleStatusReceipt.isTranferToPriceQuote = false;
              vehicleStatusReceipt.TimeCreate = TimeUpdate;
              vehicleStatusReceipt.VehicleStatusID = vehicleStatus.id;
              vehicleStatusReceipt.ReceiptID = receiptId;
              vehicleStatusReceipt.RepairOrderID = null;
        
              await VehicleStatusReceiptRepo.save(vehicleStatusReceipt);
            } catch (error) {
              console.error('Error saving VehicleStatusReceipt:', error);
            }
          } else {
            return res.status(500).json({
              error: 'Duplicate pair found:',
            });
          }
        }
        await receiptRepo.save(receipt);
      } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
          error: 'An error occurred while processing the request.',
        });
      }
      

      return res.json({
        message: messages.updateReceiptSuccessful,
      });
    } catch (error) {
      return res.status(500).json({
        error: messages.internalServerError + error,
      });
    }
  }
    // DELETE a receipt by ID
  async delete(req, res) {
    try {
      const receiptId = req.params.id;
      const receiptRepo = AppDataSource.getRepository(Receipt);
      const receipt = await receiptRepo.findOne({
        where: { ReceiptID: receiptId, isActive: true },
      });

      if (!receipt) {
        return res.status(404).json({ message: messages.notFound });
      }

      receipt.isActive = false;

      await receiptRepo.save(receipt);

      return res.status(200).json({ message: messages.deleteReceiptSuccessful });
    } catch (error) {
      return res.status(500).json({
        error: messages.internalServerError,
      });
    }
  }
  async checkExistPriceQuote(req, res) {
    try {
      const receiptId = req.params.id;
   
      const receiptRepo = AppDataSource.getRepository(Receipt);
      const priceQuoteRepo = AppDataSource.getRepository(PriceQuote);

      let exitsPriceQuote = await priceQuoteRepo.findOne({where:{ReceiptID: receiptId}});
     if (exitsPriceQuote) {
      return res.status(200).json({ existPriceQuote: true });
     }else{
      return res.status(200).json({ existPriceQuote: false });
     }
      
    } catch (error) {
      return res.status(500).json({ error: messages.internalServerError });
    }
  }










  // THong ke

  async getTotalReceiptsByTime(req, res) {
    try {
      const { startDate, endDate } = req.query; // Lấy startDate và endDate từ query parameters
      const receiptRepo = AppDataSource.getRepository(Receipt);
      
      const totalReceipts = await receiptRepo
        .createQueryBuilder('receipt')
        .where('receipt.TimeCreate >= :startDate', { startDate })
        .andWhere('receipt.TimeCreate <= :endDate', { endDate })
        .getCount();
      
      return res.json({ totalReceipts });
    } catch (error) {
      return res.status(500).json({ error: messages.internalServerError });
    }
  }

  
  async getTotalReceiptsByVehicleStatus(req, res) {
    try {
      const { vehicleStatus } = req.query; 
      const receiptRepo = AppDataSource.getRepository(Receipt);
      
      const totalReceipts = await receiptRepo
        .createQueryBuilder('receipt')
        .where('receipt.VehicleStatus = :vehicleStatus', { vehicleStatus })
        .getCount();
      
      return res.json({ totalReceipts });
    } catch (error) {
      return res.status(500).json({ error: messages.internalServerError });
    }
  }

  async getTotalReceiptsByStaff(req, res) {
    try {
      const { staffId } = req.query; 
      const receiptRepo = AppDataSource.getRepository(Receipt);
      
      const totalReceipts = await receiptRepo
        .createQueryBuilder('receipt')
        .where('receipt.StaffID = :staffId', { staffId })
        .getCount();
      
      return res.json({ totalReceipts });
    } catch (error) {
      return res.status(500).json({ error: messages.internalServerError });
    }
  }
  
  async getReceiptsByCustomer(req, res) {
    try {
      const { customerId } = req.params; // Lấy ID của khách hàng từ route parameters
      const receiptRepo = AppDataSource.getRepository(Receipt);
      
      const receipts = await receiptRepo
        .createQueryBuilder('receipt')
        .where('receipt.CustomerID = :customerId', { customerId })
        .getMany();
      
      return res.json(receipts);
    } catch (error) {
      return res.status(500).json({ error: messages.internalServerError });
    }
  }
  
 
}

export default new ReceiptService();
