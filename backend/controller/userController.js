import { pool } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// CREATE USER
export const saveUser = async (req, res) => {
    try {
        let data = req.body;
        let { password } = data;

        const saltRounds = 10;
        data.password = await bcrypt.hash(password, saltRounds);

        // Postgres query with $ placeholders
        const query = `INSERT INTO users (username, email, password, phone) 
                       VALUES ($1, $2, $3, $4) RETURNING id`;

        const values = [data.username, data.email, data.password, data.phone];
        const result = await pool.query(query, values);

        res.status(201).json({
            success: true,
            message: "User saved successfully",
            id: result.rows[0].id
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

// GET ALL USERS
export const getAllUsers = async (req, res) => {
    try {
        const query = "SELECT * FROM users";
        const result = await pool.query(query);
        res.status(200).json({
            success: true,
            data: result.rows
        });
    }
    catch (err) {
        console.log("can not get user : ", err);
        res.status(500).json({
            message: "can not get user",
            error: "Internal server Error"
        });
    }
}

// DELETE USER
export const deleteUserById = async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Missing query data"
            });
        }

        const query = "DELETE FROM users WHERE id = $1 RETURNING *";
        const result = await pool.query(query, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    }
    catch (err) {
        console.log("can not delete user", err);
        return res.status(500).json({
            success: false,
            error: "Internal server error",
            message: "can not delete user"
        });
    }
}

// LOGIN USER
export const loginUser = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: "Missing request body"
            });
        }
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Missing email or password"
            });
        }

        const query = "SELECT id, username, password FROM users WHERE email = $1";
        const result = await pool.query(query, [email]);

        if (result.rowCount === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid email"
            });
        }

        const data = result.rows[0];
        const isEqual = await bcrypt.compare(password, data.password);

        if (!isEqual) {
            return res.status(400).json({
                success: false,
                message: "Invalid password"
            });
        }

        const { id, username } = data;
        const user = { id, username, email };

        const secretKey = process.env.SECRET_KEY;
        const accessTokenexpiresIn = "1m";

        const tokenAccess = jwt.sign(user, secretKey, { expiresIn: accessTokenexpiresIn });
        const maxAgeOfTokenAccess = 60 * 1000; // 1 minute

        res.cookie("tokenAccess", tokenAccess, {
            maxAge: maxAgeOfTokenAccess,
            httpOnly: true,
            sameSite: "strict"
        });

        const refreshTokenexpiresIn = "7d";
        const tokenRefresh = jwt.sign(user, "abc123", { expiresIn: refreshTokenexpiresIn });
        const maxAgeOfTokenRefresh = 7 * 24 * 60 * 60 * 1000; // 7 days

        res.cookie("tokenRefresh", tokenRefresh, {
            maxAge: maxAgeOfTokenRefresh,
            httpOnly: true,
            sameSite: "strict"
        });

        return res.status(200).json({
            success: true,
            message: "Login successfully"
        });
    }
    catch (err) {
        console.log("login failed", err);
        return res.status(500).json({
            success: false,
            error: "Internal server error",
            message: "login failed"
        });
    }
}

// USER PROFILE
export const getUserProfile = (req, res) => {
    const { email, iat, exp } = req.user;

    const issuedTime = new Date(iat * 1000).toString();
    const expiryTime = new Date(exp * 1000).toString();

    return res.status(200).json({
        message: "Welcome to user profile",
        email,
        issuedTime,
        expiryTime
    });
}

// LOGOUT
export const logoutUser = (req, res) => {
    res.clearCookie("tokenAccess");
    res.clearCookie("tokenRefresh");

    return res.status(200).json({
        message: "Logout successfully"
    });
}
