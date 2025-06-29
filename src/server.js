require("express-async-errors");

const cors = require("cors");
const express = require("express");

const AppError = require("./utils/AppError");
const routes = require("./routes");
const uploadConfig = require("./configs/upload");

const app = express();
const PORT = 3333;

app.use(cors());
app.use(express.json());

app.use(routes);
app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }

  return response.status(500).json({
    status: "error",
    message: "Internal server error.",
  });
});

app.listen(PORT, () => console.log(`Server is now running on port: ${PORT}`));