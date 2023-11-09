

// export default router;
import { Router } from 'express';
import { VehicleStatusService } from '../service';

const router = Router();

router.get('', VehicleStatusService.getAllVehicleStatus);
router.get('/:id', VehicleStatusService.getByIdVehicleStatus);
router.post('', VehicleStatusService.createVehicleStatus);
router.patch('/:id', VehicleStatusService.updateVehicleStatus);




export default router;
