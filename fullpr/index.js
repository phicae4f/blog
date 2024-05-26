const cors = require("cors")
const express = require("express");
const connectToDataBase = require("./database/connect");
const {
  registerValidation,
  loginValidation,
  postCreateValidation,
} = require("./validations");
const checkAuth = require("./utils/checkAuth");
const { register, login, getMe } = require("./controllers/UserController");
const {
  create,
  getAll,
  getOne,
  remove,
  update,
  getLastTags
} = require("./controllers/PostController");
const multer = require("multer");
const handleValidationErrors = require("./utils/handleValidationErrors");

// import mongoose from "mongoose"
// mongoose.connect(
//     "mongodb+srv://milamasterova:wwwwww@atlascluster.swvqxbt.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster"
// ).then(( )=>
//     console.log("Connected to MongoDB")
// )
// .catch((err) =>
// console.log("MongoDB error", err))

const app = express();
const PORT = 4444;
connectToDataBase();

const storage = multer.diskStorage({
  destination: (_, __, cd) => {
    cd(null, "uploads"); //путь для сохр данных
  },
  filename: (_, file, cd) => {
    cd(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json()); //читать json
app.use(cors())
app.use("/uploads", express.static("uploads")); //get на получсение статики

app.post("/auth/login", loginValidation, handleValidationErrors, login);
app.post(
  "/auth/register",
  handleValidationErrors,
  registerValidation,
  register
);
app.get("/auth/me", checkAuth, getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/posts", getAll);
app.get("/tags", getLastTags);
app.get("/posts/:id", getOne);
app.get("/posts/tags", getLastTags);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  create
);
app.delete("/posts/:id", checkAuth, remove); //сначала ошибка, но в итоге удаляется все равно
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  update
);

app.listen(PORT, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log(`Server is running on port ${PORT}`);
});
