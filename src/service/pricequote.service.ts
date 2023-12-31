import { AppDataSource } from "../data-source";
import {
  Receipt,
  Staff,
  Service,
  Customer,
  Vehicle,
  Brand,
  PQProductDetail,
  PQServiceDetail,
  PriceQuote,
  Product,
  ProductDetail,
  RepairOrder,
  VehicleStatusReceipt,
  VehicleStatus,
} from "../model";
import messages from "../messageResponse.js";
import {mergeDataPriceQuoteUpdate} from '../utils/support'
import { getManager } from 'typeorm';

// {
//   "Status": "Pending",
//   "Time": "2023-10-21T10:00:00Z",
//   "StaffID": 1,
//   "ReceiptID": 123,
//   "priceQuoteServiceDetails": [
//     {
//       "Price": 50.00,
//       "ServiceID": 456
//     },
//     {
//       "Price": 75.00,
//       "ServiceID": 789
//     }
//   ],
//   "priceQuoteProductDetails": [
//     {
//       "SellingPrice": 100.00,
//       "PurchasePrice": 80.00,
//       "Quantity": 5
//     },
//     {
//       "SellingPrice": 150.00,
//       "PurchasePrice": 120.00,
//       "Quantity": 3
//     }
//   }
// }

class PriceQuoteService {
  async getAll(_, res) {
    try {
      const priceQuote = await AppDataSource.getRepository(PriceQuote).find({
        where: { isActive: true },
        relations: [
          "staff",
          "invoice",
          "receipt",
          "receipt.vehicle",
          "receipt.customer",
          "vehicleStatusReceipts.vehicleStatus",

          "vehicleStatusReceipts.pqServiceDetails.service",

          "vehicleStatusReceipts.pqProductDetails.productDetail.product.brand",
          "vehicleStatusReceipts.pqProductDetails.productDetail.supplier",
          "repairOrder",
        ],
      });

      return res.json(priceQuote.reverse());
    } catch (error) {
      return res
        .status(500)
        .json({ error: messages.internalServerError + error });
    }
  }

  async getById(req, res) {
    try {
      const receiptId = req.params.id;
      const receipt = await AppDataSource.getRepository(PriceQuote).findOne({
        where: { QuoteID: receiptId, isActive: true },
        relations: [
          "staff",
          "receipt",
          "priceQuoteServiceDetails",
          "priceQuoteProductDetails",
        ],
      });

      if (!receipt) {
        return res.status(404).json({ message: messages.notFound });
      }

      return res.json(receipt);
    } catch (error) {
      return res.status(500).json({ error: messages.internalServerError });
    }
  }

  // async create(req, res) {
  //   try {
  //     const priceQuoteRepository = AppDataSource.getRepository(PriceQuote);
  //     const receiptRepository = AppDataSource.getRepository(Receipt);
  //     const PQProductDetailRepository =
  //       AppDataSource.getRepository(PQProductDetail);
  //     const PQServiceDetailRepository =
  //       AppDataSource.getRepository(PQServiceDetail);
  //     const serviceRepository = AppDataSource.getRepository(Service);
  //     const productDetailRepo = AppDataSource.getRepository(ProductDetail);
  //     const repairOrderRepo = AppDataSource.getRepository(RepairOrder);
  //     const repairOrderDetailRepo =
  //       AppDataSource.getRepository(RepairOrderDetail);

  //     const {
  //       Status,
  //       Time,
  //       StaffID,
  //       ReceiptID,
  //       priceQuoteServiceDetails,
  //       priceQuoteProductDetails,
  //     } = req.body;

  //     const requiredFields = [
  //       "Status",
  //       "Time",
  //       "StaffID",
  //       "ReceiptID",
  //       "priceQuoteServiceDetails",
  //       "priceQuoteProductDetails",
  //     ];

  //     const missingFields = requiredFields.filter(
  //       (field) => !req.body.hasOwnProperty(field)
  //     );

  //     if (missingFields.length > 0) {
  //       return res.status(400).json({
  //         code: 400,
  //         message: `Missing fields: ${missingFields.join(", ")}`,
  //       });
  //     }
  //     console.log("status:", Status);

  //     let CheckAcceptedRepair = false;
  //     if (Status == 1) {
  //       CheckAcceptedRepair = true;
  //     }

  //     let existPriceQuote = await priceQuoteRepository.findOne({
  //       where: { ReceiptID: ReceiptID },
  //     });

  //     if (existPriceQuote) {
  //       return res.status(400).json({
  //         code: 400,
  //         message: `PriceQuote exist !!!`,
  //       });
  //     }

  //     const newPriceQuote = new PriceQuote();
  //     newPriceQuote.Status = Status;
  //     newPriceQuote.ReceiptID = ReceiptID;
  //     newPriceQuote.Time = Time;
  //     newPriceQuote.StaffID = StaffID;
  //     newPriceQuote.isActive = true;
  //     let existReceipt = await receiptRepository.findOne({
  //       where: { ReceiptID: ReceiptID },
  //     });

  //     newPriceQuote.receipt = existReceipt;

  //     console.log("find status of new pricequote:", newPriceQuote.Status);

  //     await priceQuoteRepository.save(newPriceQuote);

  //     // tao phieu sua chua, nhung chua cho sua chua;
  //     const newRepairOrder = new RepairOrder();
  //     newRepairOrder.IsDone = false;
  //     newRepairOrder.QuoteID = newPriceQuote.QuoteID;
  //     newRepairOrder.priceQuote = newPriceQuote;
  //     console.log("newPriceQuote.QuoteID", newPriceQuote.QuoteID);

  //     await repairOrderRepo.save(newRepairOrder);

  //     let newPriceQuoteServiceDetails = [];
  //     let newPriceQuoteProductDetails = [];

  //     for (const priceQuoteServiceElement of priceQuoteServiceDetails) {
  //       let newPriceQuoteService = new PQServiceDetail();
  //       newPriceQuoteService.Price = priceQuoteServiceElement.Price;
  //       newPriceQuoteService.ServiceID = priceQuoteServiceElement.ServiceID;
  //       newPriceQuoteService.QuoteID = newPriceQuote.QuoteID;
  //       newPriceQuoteService.priceQuote = newPriceQuote;
  //       newPriceQuoteService.isAcceptedRepair = CheckAcceptedRepair;
  //       PQServiceDetailRepository.save(newPriceQuoteService);

  //       //tao chi tiet sua chua
  //       let newRepairOrderDetail = new RepairOrderDetail();
  //       newRepairOrderDetail.IsDone = false;
  //       newRepairOrderDetail.RepairOrderID = newRepairOrder.RepairOrderID;
  //       newRepairOrderDetail.StaffID = priceQuoteServiceElement.Technician;
  //       newRepairOrderDetail.pqServiceDetail = newPriceQuoteService;
  //       repairOrderDetailRepo.save(newRepairOrderDetail);

  //       newPriceQuoteServiceDetails.push(newPriceQuoteService);
  //     }

  //     for (const priceQuoteProductElement of priceQuoteProductDetails) {
  //       let newPriceQuoteProduct = new PQProductDetail();
  //       newPriceQuoteProduct.SellingPrice =
  //         priceQuoteProductElement.SellingPrice;
  //       newPriceQuoteProduct.PurchasePrice =
  //         priceQuoteProductElement.PurchasePrice;
  //       newPriceQuoteProduct.Quantity = priceQuoteProductElement.Quantity;
  //       newPriceQuoteProduct.isAcceptedRepair = CheckAcceptedRepair;

  //       let productDetail = await productDetailRepo.findOne({
  //         where: {
  //           ProductDetailID: priceQuoteProductElement.productDetailID,
  //           isActive: true,
  //         },
  //       });
  //       newPriceQuoteProduct.priceQuote = newPriceQuote;
  //       newPriceQuoteProduct.productDetail = productDetail;
  //       newPriceQuoteProduct.QuoteID = newPriceQuote.QuoteID;
  //       PQProductDetailRepository.save(newPriceQuoteProduct);
  //       newPriceQuoteProductDetails.push(newPriceQuoteProduct);
  //     }
  //     newPriceQuote.priceQuoteProductDetails = newPriceQuoteProductDetails;
  //     newPriceQuote.priceQuoteServiceDetails = newPriceQuoteServiceDetails;

  //     return res.status(201).json({
  //       message: "Tao phieu bao gia thanh cong",
  //     });
  //   } catch (error) {
  //     return res.status(500).json({
  //       error: messages.internalServerError + error,
  //     });
  //   }
  // }

  //

  async create(req, res) {
    const { Status, Time, StaffID, ReceiptID, vehicleStatus } = req.body;
    const requiredFields = [
      "Status",
      "Time",
      "StaffID",
      "ReceiptID",
      "vehicleStatus",
    ];
    const missingFields = requiredFields.filter(
      (field) => !req.body.hasOwnProperty(field)
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        code: 400,
        message: `Missing fields: ${missingFields.join(", ")}`,
      });
    }

    let CheckAcceptedRepair = Status === 1;

    try {
      const priceQuoteRepository = AppDataSource.getRepository(PriceQuote);
      const receiptRepository = AppDataSource.getRepository(Receipt);
      const PQProductDetailRepository =
        AppDataSource.getRepository(PQProductDetail);
      const PQServiceDetailRepository =
        AppDataSource.getRepository(PQServiceDetail);
      const repairOrderRepo = AppDataSource.getRepository(RepairOrder);
      const vehicleStatusReceiptRepo =
        AppDataSource.getRepository(VehicleStatusReceipt);
      const productDetailRepo = AppDataSource.getRepository(ProductDetail);

      const existPriceQuote = await priceQuoteRepository.findOne({
        where: { ReceiptID: ReceiptID },
      });

      if (existPriceQuote) {
        return res.status(500).json({
          error: `Exist PriceQuote`,
        });
      }

      const newPriceQuote = new PriceQuote();
      newPriceQuote.Status = Status;
      newPriceQuote.ReceiptID = ReceiptID;
      newPriceQuote.Time = Time;
      newPriceQuote.StaffID = StaffID;
      newPriceQuote.isActive = true;

      const existReceipt = await receiptRepository.findOne({
        where: { ReceiptID: ReceiptID },
      });
    
      newPriceQuote.receipt = existReceipt;

      // const newRepairOrder = new RepairOrder();
      // newRepairOrder.IsDone = false;
      // newRepairOrder.priceQuote = newPriceQuote;

      await priceQuoteRepository.save(newPriceQuote);
      // await repairOrderRepo.save(newRepairOrder);


      for (const vehicleStatusElement of vehicleStatus) {


        let pqServiceArr = vehicleStatusElement.pqService || [];

        for (const priceQuoteServiceElement of pqServiceArr) {
          let newPQService = new PQServiceDetail();
          newPQService.Price = priceQuoteServiceElement.Price;
          newPQService.ServiceID = priceQuoteServiceElement.ServiceID;
          newPQService.VehicleStatusReceipt = vehicleStatusElement;
          await PQServiceDetailRepository.save(newPQService);
        }

        let pqProductArr = vehicleStatusElement.pqProduct || [];

        for (const priceQuoteProductElement of pqProductArr) {
          let newPQProduct = new PQProductDetail();
          newPQProduct.SellingPrice = priceQuoteProductElement.SellingPrice;
          newPQProduct.PurchasePrice = priceQuoteProductElement.PurchasePrice;
          newPQProduct.Quantity = priceQuoteProductElement.Quantity;
          newPQProduct.isAcceptedRepair = CheckAcceptedRepair;
          newPQProduct.vehicleStatusReceipt = vehicleStatusElement;

          let productDetail = await productDetailRepo.findOne({
            where: {
              ProductDetailID: priceQuoteProductElement.productDetailID,
              isActive: true,
            },
          });

          newPQProduct.productDetail = productDetail;
          await PQProductDetailRepository.save(newPQProduct);
        }

        const updateVehicleStatus = await vehicleStatusReceiptRepo.findOne({
          where: { ID: vehicleStatusElement.ID },
        });

        if (updateVehicleStatus) {
          updateVehicleStatus.ReceiptID = ReceiptID;
          updateVehicleStatus.isTranferToPriceQuote = true;
          updateVehicleStatus.QuoteID = newPriceQuote.QuoteID;
          // updateVehicleStatus.RepairOrderID = newRepairOrder.RepairOrderID;
          await vehicleStatusReceiptRepo.save(updateVehicleStatus);
        } else {
          return res.status(500).json({
            error: `Error: Vehicle status receipt with ID ${vehicleStatusElement.ID} not found.`,
          });
        }
      }

     

      return res.status(201).json({
        message: "Tao phieu bao gia thanh cong",
      });
    } catch (error) {
      return res.status(500).json({
        error: `Error: ${error}`,
      });
    }
  }

  //  api/price-quote/startRepair/:id
  async startRepair(req, res) {
    try {
      const priceQuoteRepository = AppDataSource.getRepository(PriceQuote);
      const receiptRepository = AppDataSource.getRepository(Receipt);
      const PQProductDetailRepository =
        AppDataSource.getRepository(PQProductDetail);
      const PQServiceDetailRepository =
        AppDataSource.getRepository(PQServiceDetail);
      const serviceRepository = AppDataSource.getRepository(Service);
      const productDetailRepo = AppDataSource.getRepository(ProductDetail);
      const repairOrderRepo = AppDataSource.getRepository(RepairOrder);   
      const vehicleStatusReceiptRepo =
      AppDataSource.getRepository(VehicleStatusReceipt);

      const { id } = req.params;
      const existingPriceQuote = await priceQuoteRepository.findOne({
        where: { QuoteID: id },
      });

      
      if (!existingPriceQuote) {
        return res.status(404).json({
          code: 404,
          message: "Không tìm thấy phieu bao gia cần sửa chữa." + id,
        });
      }
      const { Status, Time, StaffID, ReceiptID, vehicleStatus } = req.body;
    const requiredFields = [
      "Time",
      "StaffID",
      "vehicleStatus",
    ];
    const missingFields = requiredFields.filter(
      (field) => !req.body.hasOwnProperty(field)
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        code: 400,
        message: `Missing fields: ${missingFields.join(", ")}`,
      });
    }

      let repairOrder = new RepairOrder();
      repairOrder.IsDone = false;
      repairOrder.priceQuote = existingPriceQuote;
      await repairOrderRepo.save(repairOrder);

      for (const vehicleStatusReceipt of vehicleStatus) {
        let vehicleStatusReceiptExist = await vehicleStatusReceiptRepo.findOne({where:{QuoteID: id, ID: vehicleStatusReceipt.ID}});
        vehicleStatusReceiptExist.IsRepairDone = false;
        vehicleStatusReceiptExist.IsAcceptedRepair = true;
        vehicleStatusReceiptExist.isTranferToRepairOrder = true;
        vehicleStatusReceiptExist.RepairOrderID = repairOrder.RepairOrderID;
        vehicleStatusReceiptExist.staff =  vehicleStatusReceipt.technician;
        await vehicleStatusReceiptRepo.save(vehicleStatusReceiptExist);
      }
      return res.status(201).json({
        message: "tạo lệnh sửa chữa thành công",
      });

    } catch (error) {
      return res.status(500).json({
        error: messages.internalServerError + error,
      });
    }
  }


  async update(req, res) {
    try {
      const priceQuoteRepository = AppDataSource.getRepository(PriceQuote);
      const receiptRepository = AppDataSource.getRepository(Receipt);
      const PQProductDetailRepository =
        AppDataSource.getRepository(PQProductDetail);
      const PQServiceDetailRepository =
        AppDataSource.getRepository(PQServiceDetail);
      const serviceRepository = AppDataSource.getRepository(Service);
      const productDetailRepo = AppDataSource.getRepository(ProductDetail);
      const repairOrderRepo = AppDataSource.getRepository(RepairOrder);   
      const vehicleStatusReceiptRepo =
      AppDataSource.getRepository(VehicleStatusReceipt);

      const { id } = req.params;

      const {
        Status,
        TimeUpdate,
        EditorID,
        vehicleStatus
      } = req.body;

      const requiredFields = [
        "Status",
        "TimeUpdate",
        "EditorID",
        "vehicleStatus",
      ];

      const missingFields = requiredFields.filter(
        (field) => !req.body.hasOwnProperty(field)
      );

      if (missingFields.length > 0) {
        return res.status(400).json({
          code: 400,
          message: `Missing fields: ${missingFields.join(", ")}`,
        });
      }

      const existingPriceQuote = await priceQuoteRepository.findOne({
        where: { QuoteID: id },
      });

      if (!existingPriceQuote) {
        return res.status(404).json({
          code: 404,
          message: "Không tìm thấy phieu bao gia cần cập nhật." + id,
        });
      }

      existingPriceQuote.Status = Status;
      existingPriceQuote.Editor = EditorID;
      existingPriceQuote.TimeUpdate = TimeUpdate;

      let arrIDVehicleStatusElement = [];
 


     

      for (const vehicleStatusElement of vehicleStatus) {
        arrIDVehicleStatusElement.push(vehicleStatusElement.ID);
  
        // delete all pqServiceDetail
        const pqServiceDetailDeleteResult = await PQServiceDetailRepository
        .createQueryBuilder()
        .delete()
        .where("VehicleStatusReceiptID = :vehicleStatusId", { vehicleStatusId:  vehicleStatusElement.ID })
        .execute();

        const pqProductDetailDeleteResult = await PQProductDetailRepository
        .createQueryBuilder()
        .delete()
        .where("VehicleStatusReceiptID = :vehicleStatusId", { vehicleStatusId:  vehicleStatusElement.ID })
        .execute();
        pqServiceDetailDeleteResult
        pqProductDetailDeleteResult
        // delete all pqProductDetail
        
        let pqServiceArr = vehicleStatusElement.pqService || [];

        for (const priceQuoteServiceElement of pqServiceArr) {
          let newPQService = new PQServiceDetail();
          newPQService.Price = priceQuoteServiceElement.Price;
          newPQService.ServiceID = priceQuoteServiceElement.ServiceID;
          newPQService.VehicleStatusReceipt = vehicleStatusElement;
          await PQServiceDetailRepository.save(newPQService);
        }

     


  
        let pqProductArr = vehicleStatusElement.pqProduct || [];
  
        for (const priceQuoteProductElement of pqProductArr) {
          let newPQProduct = new PQProductDetail();
          newPQProduct.SellingPrice = priceQuoteProductElement.SellingPrice;
          newPQProduct.PurchasePrice = priceQuoteProductElement.PurchasePrice;
          newPQProduct.Quantity = priceQuoteProductElement.Quantity;
          newPQProduct.vehicleStatusReceipt = vehicleStatusElement;
  
          let productDetail = await productDetailRepo.findOne({
            where: {
              ProductDetailID: priceQuoteProductElement.productDetailID,
              isActive: true,
            },
          });
  
          newPQProduct.productDetail = productDetail;
          await PQProductDetailRepository.save(newPQProduct);
        }
  
        const updateVehicleStatus = await vehicleStatusReceiptRepo.findOne({
          where: { ID: vehicleStatusElement.ID },
        });
  
        if (updateVehicleStatus) {
          updateVehicleStatus.ReceiptID = existingPriceQuote.ReceiptID;
          updateVehicleStatus.isTranferToPriceQuote = true;
          updateVehicleStatus.QuoteID = existingPriceQuote.QuoteID;
          await vehicleStatusReceiptRepo.save(updateVehicleStatus);
        } else {
          return res.status(500).json({
            error: `Error: Vehicle status receipt with ID ${vehicleStatusElement.ID} not found.`,
          });
        }
      }

       let VehicleNotInPriceQuoteButInReceipt =  await vehicleStatusReceiptRepo.find({ where:{QuoteID: id } });
        for (const vehicleStatusReceipt of VehicleNotInPriceQuoteButInReceipt) {
          if (!arrIDVehicleStatusElement.includes(vehicleStatusReceipt.ID)) {
            vehicleStatusReceipt.QuoteID = null;
            vehicleStatusReceipt.isTranferToPriceQuote = false;
            await vehicleStatusReceiptRepo.save(vehicleStatusReceipt);
          }
       }



      await priceQuoteRepository.save(existingPriceQuote);

      return res.status(201).json({
        message:  + " Cập nhật phieu bao gia thành công",
      });
    } catch (error) {
      return res.status(500).json({
        error: messages.internalServerError + error,
      });
    }
  }


}

export default new PriceQuoteService();
