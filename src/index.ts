import "dotenv/config";
import express from "express";
import cors from "cors";
import push from "./routes/push_routes";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", push);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
