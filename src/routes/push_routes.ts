import { Router } from "express";
import { pushController } from "../controllers/push_controllers";
const route = Router();

route
  .get("/push/tokens", pushController.getAllPush)
  .post("/push/", pushController.addPush)
  .post("/push/send", pushController.sendPush);

export default route;
