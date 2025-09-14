import {body} from "express-validator";

export const registrationValidator = [

      body("username").trim()
       .notEmpty()
       .withMessage("enter name")
       .isLength({min : 3})
       .withMessage("enter atleast 3 char name"),

     body("email").notEmpty()
       .withMessage("enter email")
       .normalizeEmail()
       .isEmail(),

     body("password").notEmpty()
       .withMessage("enter password")
       .isLength({min : 8 ,max:12})
       .withMessage("enter password between 8 to 12 length")
       .isStrongPassword()
       .withMessage("enter strong password using atleast one capital,one small letter, symbol,digit"),

     body("phone").notEmpty()
       .withMessage("enter phone number")
       .isLength({min : 10})
       .withMessage("enter 10 digit mobile number")
]