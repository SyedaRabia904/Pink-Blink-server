import { Router } from "express";
import jwt from 'jsonwebtoken';
import { userModel } from "../models/users.js";
import { productModel } from "../models/womanwear.js";
import multer from "multer";
import { productModel2 } from "../models/makeup.js";
import { productModel3 } from "../models/skincare.js";



const adminRouter = Router();
const upload = multer()
adminRouter.use(upload.array())

const authMiddleware= async (req,res, next) =>{
    console.log("auth middleware ");
    const token = req.headers.token;

    if(!token) {
        res.status(401).json({message: "Unauthorized"});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await userModel.findById({_id:decoded.userId });

        if(!user) {
            res.status(401).json({message: "Unauthorized"});
            res.send();
        }

        next();
    }
    catch(err) {
        res.status(401).json({message: err});
        res.send();
    }
};

adminRouter.use(authMiddleware);



adminRouter.post('/createproduct/:collection', async (req,res)=>{
    try {
        console.log(req.body);
        const collection = req.params.collection;
        const {title, description , userId, price, cover,cover2,originalprice, discount , stock } = req.body;

       // let uploadurl =  req.protocol + "://" +req.get("host") +"/" + process.env.UPLOAD_PATH +"/" + req.file.filename;

      

        let newProduct;
        if (collection === "womanwear") {
            newProduct = await productModel.create({
                cover ,
                cover2,
                title, 
                description,
                price,
                originalprice,
                discount,
                stock,
                user: userId,
            });
        } else if (collection === "makeup") {
            newProduct = await productModel2.create({
                cover,
                title, 
                description,
                price,
                originalprice,
                discount,
                stock,
                user: userId,
            });
        } else if (collection === "skincare") {
            newProduct = await productModel3.create({
                cover,
                title, 
                description,
                price,
                originalprice,
                discount,
                stock,
                user: userId,
            });
            console.log(req.body)
        }

        res.status(201).json({ newProduct });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default adminRouter;