const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../models/User");


const register=async (req, res) => {
    try {

  
      const password = req.body.password;
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
  
      //создание пользователя с моделью бд
      const doc = new UserModel({
        email: req.body.email,
        fullName: req.body.fullName,
        avatarUrl: req.body.avatarUrl,
        passwordHash: hash,
      });
  
      const user = await doc.save();
      const token = jwt.sign(
        {
          _id: user._id,
        },
        "secret123"
        //   {
        //     expriseIn: "30d", //сколько токен будет валидным
        //   },
      );
  
      const { passwordHash, ...userData } = user._doc; //инфа которая не нужна
  
      res.json({
        ...userData,
        token,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Не удалось зарегистрироваться",
      });
    }
}

const login = async (req, res) => {
    try {
      const user = await UserModel.findOne({ email: req.body.email });
  
      if (!user) {
        return res.status(404).json({
          message: "Пользователь не найден",
        });
      }
  
      const isValidPass = await bcrypt.compare(
        req.body.password,
        user._doc.passwordHash
      ); //сходится ли пароль в паролем в бд
  
      if (!isValidPass) {
        return res.status(404).json({
          message: "Неверный логин или пароль",
        });
      }
      const token = jwt.sign(
        {
          _id: user._id,
        },
        "secret123"
        //   {
        //     expriseIn: "30d", //сколько токен будет валидным
        //   },
      );
  
      const { passwordHash, ...userData } = user._doc; //инфа которая не нужна
  
      res.json({
        ...userData,
        token,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Не удалось авторизоваться",
      });
    }
}

const getMe = async (req, res) => {
    try {
      const user = await UserModel.findById(req.userId);
  
      if (!user) {
        return res.status(404).json({
          message: "Пользователь не найден",
        });
      }
  
      const { passwordHash, ...userData } = user._doc; //инфа которая не нужна
  
      res.json(userData);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Нет доступа",
      });
    }
}

module.exports={register, login, getMe}