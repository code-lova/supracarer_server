import express from "express";

const app = express();
const port = 4004

app.listen(port, () => {
  console.log(`Server is live on ${port} in dev environment`);
});
