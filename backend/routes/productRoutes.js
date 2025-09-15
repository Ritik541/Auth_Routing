/* import express from "express";
import {addProduct,getAllProducts,deleteAllProducts,deleteProductById,
        getProductById,getProductsByIds,deleteProductsByIds,updateAllProducts,
        updateProductById,updateProductsByIds} from "../controller/productController.js";
import { verifyAccessToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyAccessToken);

router.post("/addProduct",addProduct);
router.get("/getAllProducts",getAllProducts);
router.get("/getProductById",getProductById);
router.get("/getProductsByIds",getProductsByIds);
router.delete("/deleteAllProducts",deleteAllProducts);
router.delete("/deleteProductById",deleteProductById);
router.delete("/deleteProductsByIds",deleteProductsByIds);
router.put("/updateAllProducts",updateAllProducts);
router.put("/updateProductById",updateProductById);
router.put("/updateProductsByIds",updateProductsByIds);


export default router; */