import { pool } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const saveUser = async (req, res) => {
    try {
        let data = req.body;
        let { password } = data;
        const query = "insert into users (username,email,password,phone) values (?,?,?,?)";

        const saltRounds = 10;
        data.password = await bcrypt.hash(password, saltRounds);

        const values = Object.values(data);
        const [{ insertId }] = await pool.query(query, values);

        res.status(201).json({
            success: true,
            message: "User saved successfully",
            id: insertId
        });
    }
    catch (err) {
        console.log("User creation failed : ", err);
        res.status(500).json({
            message: "User creation failed",
            error: "Internal server Error"
        });
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const query = "select * from users";
        const [data] = await pool.query(query);
        console.log(data);
        res.status(200).json({
            success: true,
            data
        })
    }
    catch (err) {
        console.log("can not get user : ", err);
        res.status(500).json({
            message: "can not get user",
            error: "Internal server Error"
        });
    }
}

export const saveAllUsers = async (req, res) => {
    try {
        if(!req.body) {
            return res.status(400).json({
                success: false,
                message: "Missing request body"
            })
        }
        const users = req.body;
        const hashedUsers = [];
        const values = [];

        for (let user of users) {
            if (user.password) {
                user.password = await bcrypt.hash(user.password, 10);
            }
            hashedUsers.push(user);
        }

        const questionMarks = users.map((user) => {
            const start = "(";
            const qMarks = Object.values(user).map((val) => {
                values.push(val);
                return "?";
            });
            console.log(qMarks);
            const end = ")";
            const finalQMarks = start + qMarks + end;
            console.log(finalQMarks);
            return finalQMarks;
        })

        console.log(values);

        const query = `insert into users (username,email,phone,password) values ${questionMarks}`;
        await pool.query(query, values);

        return res.status(201).json({
            success: true,
            message: "All users saved successfully"
        });
    }
    catch (err) {
        console.log("can not save users : ", err);
        return res.status(500).json({
            success: false,
            error: "Internal server error",
            message: "can not save user"
        });
    }
}

export const deleteAllUsers = async (req, res) => {
    const query = "delete from users";
    const [{ affectedRows }] = await pool.query(query);

    if (affectedRows === 0) {
        return res.status(404).json({
            success: false,
            message: "No users found to delete"
        })
    }

    return res.status(200).json({
        success: true,
        message: "All users deleted successfully"
    })
}

export const deleteUserById = async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Missing query data"
            })
        }

        const query = "delete from users where id = ?";
        const [{ affectedRows }] = await pool.query(query, [id]);

        if (affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        })
    }
    catch (err) {
        console.log("can not delete user", err)
        return res.status(500).json({
            success: false,
            error: "Internal server error",
            message: "can not delete user"
        });
    }
}

export const loginUser = async (req, res) => {
    try {
        if(!req.body) {
            return res.status(400).json({
                success: false,
                message: "Missing request body"
            })
        }
        const {email , password} = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Missing email or password"
            })
        }

        const query = "select id,username,password from users where email = ?";
        const [[data]] =  await pool.query(query, [email]);

        if(!data.password) {
            return res.status(400).json({
                 success : false,
                 message : "Invalid email"
            });
        }

        const hashedPassword = data.password;
        const isEqual =  bcrypt.compare(password,hashedPassword);

        if(!isEqual) {
            return res.status(400).json({
                 success : false,
                 message : "Invalid password"
            });
        }
         
        const {id,username} = data;
        const user = {id,username,email};

        const secretKey = process.env.SECRET_KEY;
        const accessTokenexpiresIn = "1m";
        const tokenAccess = jwt.sign(user,secretKey,{expiresIn : accessTokenexpiresIn});
        const maxAgeOfTokenAccess = parseInt(accessTokenexpiresIn) * 60 * 60 * 1000;
        res.cookie("tokenAccess",tokenAccess,{
            maxAge : maxAgeOfTokenAccess,
            httpOnly : true,
            samesite : "strict"
        });


        const refreshTokenexpiresIn = "7d";
        const tokenRefresh = jwt.sign(user,"abc123",{expiresIn : refreshTokenexpiresIn});
        const maxAgeOfTokenRefresh = parseInt(refreshTokenexpiresIn) * 24 * 60 * 60 * 1000;
        res.cookie("tokenRefresh",tokenRefresh,{
            maxAge : maxAgeOfTokenRefresh,
            httpOnly : true,
            samesite : "strict"
        });

        return res.status(200).json({
            success: true,
            message: "Login successfully"
        })
    }
    catch (err) {
        console.log("login failed", err)
        return res.status(500).json({
            success: false,
            error: "Internal server error",
            message: "login failed"
        });
    }
}

export const getUserProfile = (req,res) => {
    const {email,iat,exp} = req.user;

    const issuedTime = new Date(iat*1000).toString();
    const expiryTime = new Date(exp*1000).toString();

    return res.status(200).json({
        message : "Welcome to user profile",
        email,
        issuedTime,
        expiryTime
    });
}

export const logoutUser = (req,res) => {
    res.clearCookie("tokenAccess");
    res.clearCookie("tokenRefresh");

    return res.status(200).json({
        message : "Logout successfully"
     });
}