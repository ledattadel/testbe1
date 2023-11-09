import { AppDataSource } from '../data-source';
import { Receipt , Staff, Customer, Vehicle, Brand, VehicleStatus} from '../model'; // Đảm bảo bạn import model `Receipt`
import messages from '../messageResponse.js';
import {parseDateStringToDate, spitDateFromString, compareDateStrings, compare2DateBetweenStrings} from '../utils/support'
class VehicleStatusService {


  async getByIdVehicleStatus(req, res) {

  }
  async createVehicleStatus(req, res) {
    try {
      const vehicleStatusRepo = AppDataSource.getRepository(VehicleStatus);
      const receiptRepo = AppDataSource.getRepository(Receipt);
      const { name, condition, isDone, isTranferToPriceQuote, receiptId } = req.body;
      
      if (!name  ) {
        return res.status(400).json({
          code: 400,
          message: "Missing vehicle status fields",
        });
      }
  
      const receiptQuery = await receiptRepo.findOne({ where: { ReceiptID: receiptId } });
  
      // if (!receiptQuery) {
      //   return res.status(404).json({ message:"Receipt not found" });
      // }
  
      const vehicleStatus = new VehicleStatus();
      vehicleStatus.Name = name;
      vehicleStatus.Condition = condition || null;
      vehicleStatus.IsDone = isDone || false;
      vehicleStatus.isTranferToPriceQuote = isTranferToPriceQuote || false;
      vehicleStatus.ReceiptId = receiptId || null;
  
      await vehicleStatusRepo.save(vehicleStatus);
  
      return res.status(201).json({
        message: "Create vehicle status successful",
      });
    } catch (error) {
      return res.status(500).json({
        error: messages.internalServerError,
      });
    }
  }
  async getAllVehicleStatus(req, res) {
    try {
      const vehicleStatusRepo = AppDataSource.getRepository(VehicleStatus);
      const vehicleStatuses = await vehicleStatusRepo.find({});
      return res.json(vehicleStatuses);
    } catch (error) {
      return res.status(500).json({ error: error});
    }
  }
  async updateVehicleStatus(req, res) {
    try {
        const vehicleStatusRepo = AppDataSource.getRepository(VehicleStatus);
        const { id } = req.params;
        const { name, condition, isDone, isTranferToPriceQuote, receiptId } = req.body;
        const vehicleStatus = await vehicleStatusRepo.findOne({ where: { ID: id } });
        if (!vehicleStatus) {
          return res.status(404).json({ message: "Vehicle status not found" });
        }
        vehicleStatus.Name = name || vehicleStatus.Name;
        vehicleStatus.Condition = condition || vehicleStatus.Condition;
        vehicleStatus.IsDone = isDone || vehicleStatus.IsDone;
        vehicleStatus.isTranferToPriceQuote = isTranferToPriceQuote || vehicleStatus.isTranferToPriceQuote;
        vehicleStatus.ReceiptId = receiptId || vehicleStatus.ReceiptId;
        await vehicleStatusRepo.save(vehicleStatus);
        return res.status(200).json({ message: "update vehicle status successful" });
    }catch(error){
        return res.status(500).json({ error: error});
    }
  }
   async deleteVehicleStatus(req, res) {
        try {
            const vehicleStatusRepo = AppDataSource.getRepository(VehicleStatus);
            const { id } = req.params;
            const vehicleStatus = await vehicleStatusRepo.findOne({ where: { ID: id } });
            if (!vehicleStatus) {
              return res.status(404).json({ message: "Vehicle status not found" });
            }
            await vehicleStatusRepo.remove(vehicleStatus);
            return res.status(200).json({ message: "Delete vehicle status successful" });
    }
    catch(error){
        return res.status(500).json({ error: error});
    }
   }

}

export default new VehicleStatusService();
