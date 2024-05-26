const {body} = require("express-validator")

const registerValidation = [
    body("email", "Неверный формат почты").isEmail(),
    body("password", "Пароль должен быть минимум 5 символов").isLength({min:5}),
    body("fullName", "Укажите имя").isLength({min: 7}),
    body("avatarUrl", "Неверная ссылка на аватарку").optional().isURL(), //необязательно, но если да - то проверить
]

const loginValidation = [
    body("email", "Неверный формат почты").isEmail(),
    body("password", "Пароль должен быть минимум 5 символов").isLength({min:5}),
    
]


const postCreateValidation = [
    body("title", "Введите заголовок статьи").isLength({min: 3}).isString(),
    body("text", "Введите текст статьи").isLength({min:3}).isString(),
    body("tags", "Неверный формат тэгов (укажите массив)").optional().isString(),
    body("imageUrl", "Неверная ссылка на изображение").optional().isString(), //необязательно, но если да - то проверить
]


module.exports = {registerValidation, loginValidation, postCreateValidation}