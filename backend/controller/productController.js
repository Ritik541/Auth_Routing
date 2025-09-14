import { pool } from "../config/db.js";


export const addProduct = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({
                message: "Missing request body"
            });
        }
        const product = req.body;

        if (!product) {
            return res.status(400).json({
                message: "Missing product data"
            });
        }

        const query = "insert into products (name,price,quantity,category,description) values (?,?,?,?,?)";

        const values = Object.values(product);

        const [{ insertId }] = await pool.query(query, values);

        return res.status(201).json({
            success: true,
            message: "Product added successfully",
            id: insertId
        });
    }
    catch (err) {
        console.log("can not add product : ", err);
        return res.status(500).json({
            error: "can not add product",
            message: "Internal server error"
        });
    }

}

export const addAllProducts = (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({
                message: "Missing request body"
            });
        }
        const products = req.body;
        
        const columns = [];
         

        const query = `insert into products `;
    }
    catch (err) {
        console.log("can not add products : ", err);
        return res.status(500).json({
            error: "can not add products",
            message: "Internal server error"
        });
    }
}

export const getAllProducts = async (req, res) => {
    try {
        const query = "select * from products";

        const [data] = await pool.query(query);

        console.log(data);

        return res.status(200).json({
            data
        });
    }
    catch (err) {
        console.log("can not get products : ", err);
        res.status(500).json({
            error: "Internal server error",
            message: "can not get products"
        });
    }
}

export const getProductById = async (req, res) => {
    try {
        const {id} = req.query;
        if(!id) {
            return res.status(400).json({
                message : "Missing id"
            });
        }
         
        const query = `select * from products where id = ?`;

        const [data] = await pool.query(query,[id]);

        console.log(data);

        return res.status(200).json({
            data
        });
    }
    catch (err) {
        console.log("can not get product : ", err);
        res.status(500).json({
            error: "Internal server error",
            message: "can not get product"
        });
    }
}

export const getProductsByIds = async (req, res) => {
    try {
        const {ids} = req.query;
        const productIds = ids.split(",");
        if(!productIds) {
            return res.status(400).json({
                message : "Missing ids"
            });
        }

        const questionMarks = productIds.map(() => "?");

        const query = `select * from products where id in (${questionMarks})`;

        const [data] = await pool.query(query,productIds);

        console.log(data);

        return res.status(200).json({
            data
        });
    }
    catch (err) {
        console.log("can not get products : ", err);
        res.status(500).json({
            error: "Internal server error",
            message: "can not get products"
        });
    }
}


export const deleteAllProducts = async (req, res) => {
    try {
        const query = "delete from products";

        const [{affectedRows}] = await pool.query(query);

        if(affectedRows === 0) {
            return res.status(404).json({
                message : "No products found to delete"
            });
        }

        return res.status(200).json({
            success : true,
            message : "All products deleted successfully"
        });
    }
    catch (err) {
        console.log("can not delete products : ", err);
        res.status(500).json({
            error: "Internal server error",
            message: "can not delete products"
        });
    }
}

export const deleteProductById = async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({
                message: "Missing id"
            });
        }

        const query = "delete from products where id = ?";
        const [{ affectedRows }] = await pool.query(query, [id]);

        if (affectedRows === 0) {
            return res.status(404).json({
                message: `id ${id} product does not exist`
            });
        }

        return res.status(200).json({
            success: true,
            message: `id ${id} product deleted successfully`
        });
    }
    catch (err) {
        console.log("can not delete product : ", err);
        res.status(500).json({
            error: "Internal server error",
            message: "can not delete product"
        });
    }
}

export const deleteProductsByIds = async (req, res) => {
    try {
        const {ids} = req.query;
        const productIds = ids.split(",");

        if (!ids) {
            return res.status(400).json({
                message: "Missing ids"
            });
        }

        const questionMarks = productIds.map(() => "?");

        const query = `delete from products where id in (${questionMarks})`;

        const [{ affectedRows }] = await pool.query(query,productIds);

        if (affectedRows === 0) {
            return res.status(404).json({
                message: `ids ${ids} product does not exist`
            });
        }

        return res.status(200).json({
            success: true,
            message: `products deleted successfully`
        });
    }
    catch (err) {
        console.log("can not delete products : ", err);
        res.status(500).json({
            error: "Internal server error",
            message: "can not delete products"
        });
    }
}

export const updateAllProducts = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({
                message: "Missing request body"
            });
        }
        const productData = req.body;

        if (!productData) {
            return res.status(400).json({
                message: "Missing product data to update"
            });
        }

        const productKeys =  Object.keys(productData);

        const getColumns_QuestionMarks = productKeys.map((key) => `${key} = ?`);

        console.log(getColumns_QuestionMarks);

        const query = `update products set ${getColumns_QuestionMarks}`;

        console.log(query);

        const productValues = Object.values(productData);

        const [{affectedRows}] = await pool.query(query,productValues);

        if(affectedRows === 0) {
            return res.status(404).json({
             message : `No product found to delete`
            });
        }

        return res.status(200).json({
             message : `All products fields [${productKeys}] updated successfully`
        });
    }
    catch (err) {
        console.log("can not update products : ", err);
        res.status(500).json({
            error: "Internal server error",
            message: "can not update products"
        });
    }
}

export const updateProductById = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({
                message: "Missing request body"
            });
        }
        const productData = req.body;
        const {id} = req.query;

        if (!productData || !id) {
            return res.status(400).json({
                message: "Missing product data or id to update"
            });
        }

        const productKeys = Object.keys(productData);

        const getColumns_QuestionMarks = productKeys.map((key) => `${key} = ?`);

        const query = `update products set ${getColumns_QuestionMarks} where id = ?`;

        const productValues = Object.values(productData);

        productValues.push(id);

        const [{affectedRows}] = await pool.query(query,productValues);

        if(affectedRows === 0) {
            return res.status(404).json({
                message : `id ${id} product does not exist`
            });
        }

        return res.status(200).json({
            success : true,
            message : `product updated successfully`,
            id
        });

    }
    catch (err) {
        console.log("can not update product : ", err);
        res.status(500).json({
            error: "Internal server error",
            message: "can not update product"
        });
    }
}

export const updateProductsByIds = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({
                message: "Missing request body"
            });
        }
        const productData = req.body;
        const {ids} = req.query;

        const productIds = ids.split(",");

        if (!productData || !productIds) {
            return res.status(400).json({
                message: "Missing product data or ids to update"
            });
        }

        const productKeys = Object.keys(productData);
        const productValues = Object.values(productData);

        const getColumnsWithQuestionMarks = productKeys.map((key) => `${key} = ?`);

        const getConditionQuestionMarks = productIds.map((id) => {
            productValues.push(id);
            return "?"
        });

        const query = `update products set ${getColumnsWithQuestionMarks} where id in (${getConditionQuestionMarks})`;

        console.log(query);

        console.log(productValues);

        const [{affectedRows}] = await pool.query(query,productValues);

        if(affectedRows === 0) {
            return res.status(404).json({
                message : `ids ${ids} products does not exist`
            });
        }

        return res.status(200).json({
            success : true,
            message : `product updated successfully`,
            ids
        });

    }
    catch (err) {
        console.log("can not update product : ", err);
        res.status(500).json({
            error: "Internal server error",
            message: "can not update product"
        });
    }
}

