"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const push_controllers_1 = require("../controllers/push_controllers");
const route = (0, express_1.Router)();
route
    .get("/push/tokens", push_controllers_1.pushController.getAllPush)
    .post("/push/", push_controllers_1.pushController.addPush)
    .post("/push/send", push_controllers_1.pushController.sendPush);
exports.default = route;
//# sourceMappingURL=push_routes.js.map