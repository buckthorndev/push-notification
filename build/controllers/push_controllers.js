"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushController = void 0;
const client_1 = require("@prisma/client");
const app_1 = require("firebase-admin/app");
const messaging_1 = require("firebase-admin/messaging");
const prisma = new client_1.PrismaClient();
exports.pushController = {
    getAllPush: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const tokens = yield prisma.user.findMany();
        return res.send(tokens);
    }),
    addPush: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = req.body;
        if (!token) {
            return res.status(401).send({ message: "Missing token" });
        }
        try {
            const response = yield prisma.user.create({
                data: {
                    token,
                },
            });
            return res.send(response);
        }
        catch (error) {
            return res.status(500).send({ message: "Something went wrong" });
        }
    }),
    sendPush: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { user_id, title, body } = req.body;
        if (!user_id || !title || !body) {
            return res.status(401).send({ message: "Missing data" });
        }
        const user = yield prisma.user.findFirst({
            where: {
                id: user_id,
            },
        });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        const app = (0, app_1.initializeApp)({
            credential: (0, app_1.applicationDefault)(),
        });
        const message = (0, messaging_1.getMessaging)(app);
        message
            .sendToDevice(user.token, {
            notification: {
                title,
                body,
            },
        })
            .then(function (_) {
            return res.send({ message: "Push notification sent" });
        })
            .catch(function (error) {
            console.log(error);
            return res.status(500).send({ message: "Something went wrong" });
        });
    }),
};
//# sourceMappingURL=push_controllers.js.map