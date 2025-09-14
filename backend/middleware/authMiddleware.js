import jwt from "jsonwebtoken";

export const verifyAccessToken = (req, res, next) => {
    try {
        const { tokenAccess } = req.cookies;

        if (!tokenAccess) {
        
            return res.status(401).json({
                success: false,
                message: "Token not found or Unauthorized"
            });
        }

        const secretKey = process.env.SECRET_KEY;
        const verifiedToken = jwt.verify(tokenAccess, secretKey);

        req.user = verifiedToken;
        next();
    }
    catch (err) {
        console.log("Access Token verification failed : ", err);
        res.status(401).json({
            success : false,
            error: "Invalid Access Token or Access Token expried"
        });
    }
}

export const verifyRefreshToken = (req, res, next) => {
    try {
        const tokenRefresh = req.cookies.tokenRefresh;

        if (!tokenRefresh) {
            return res.status(401).json({
                success: false,
                message: "Refresh Token not found or Unauthorized"
            });
        }

        const verifiedRefreshToken = jwt.verify(tokenRefresh, "abc123");

        const { id, username, email } = verifiedRefreshToken;
        const user = { id, username, email };

        const secretKey = process.env.SECRET_KEY;
        const accessTokenexpiresIn = "1m";
        const tokenAccess = jwt.sign(user, secretKey, { expiresIn: accessTokenexpiresIn });
        const maxAgeOfTokenAccess = parseInt(accessTokenexpiresIn) * 60  * 1000;
        res.cookie("tokenAccess", tokenAccess, {
            maxAge: maxAgeOfTokenAccess,
            httpOnly: true,
            samesite: "strict"
        });

        res.send("Access Token generated..");
    }
    catch (err) {
        console.log("Refresh Token verification failed : ", err);
        res.status(401).json({
            success : false,
            error: "Invalid Refresh Token or Refresh Token expried"
        });
    }
}