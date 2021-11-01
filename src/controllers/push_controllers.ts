import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

const prisma = new PrismaClient();
const app = initializeApp({
  credential: applicationDefault(),
});

const message = getMessaging(app);
export const pushController = {
  getAllPush: async (req: Request, res: Response) => {
    const tokens = await prisma.user.findMany();
    return res.send(tokens);
  },
  addPush: async (req: Request, res: Response) => {
    const { token } = req.body;
    if (!token) {
      return res.status(401).send({ message: "Missing token" });
    }
    try {
      const response = await prisma.user.create({
        data: {
          token,
        },
      });
      return res.send(response);
    } catch (error) {
      return res.status(500).send({ message: "Something went wrong" });
    }
  },
  sendPush: async (req: Request, res: Response) => {
    const { user_id, title, body } = req.body;
    if (!user_id || !title || !body) {
      return res.status(401).send({ message: "Missing data" });
    }
    const user = await prisma.user.findFirst({
      where: {
        id: user_id,
      },
    });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    message
      .sendToDevice(user.token, {
        notification: {
          title,
          body,
        },
      })
      .then(function(_) {
        return res.send({ message: "Push notification sent" });
      })
      .catch(function(error) {
        console.log(error);
        return res.status(500).send({ message: "Something went wrong" });
      });
  },
};
