const CustomerModel= require("../../models/customer");
const jwt = require("jsonwebtoken");
const config = require("config")
const registerCustomer = async(req, res)=>{
    try{
        const {body} = req
        const customer = await CustomerModel.findOne({email:body.email})
        if (customer){
            return res.status(401).json("Email existed");

        }
        const isPhoneExists = await CustomerModel.findOne({phone:body.phone})
        if (isPhoneExists){
            return res.status(401).json("Phone number existed");
        }
        await new CustomerModel({
            full_name: body.full_name,
            email:body.email,
            password:body.password,
            phone:body.phone,
            address:body.address,
        }).save()
        return res.status(201).json("Create customer successfully")
    }catch(error){
        return res.status(500).json(error);
    }
}
const loginCustomer = async(req, res)=>{
try {
    const {body} = req;
    const customer = await CustomerModel.findOne({email:body.email});
    if(!customer){
        return res.status(401).json("Email not valid")
    }
    const validPassword = customer.password === body.password;
    if(!validPassword){
        return res.status(401).json("password not valid");
        
    }
    if(customer &&validPassword){
        const accessToken =jwt.sign(
            {email:body.email, password:body.password},
            config.get("app.jwtAccessKey"),
            {expiresIn:"1d"}
        )
       
        
        res.cookie("token",accessToken);
        const {password,...others} = customer._doc;
        return res.status(200).json({
            ...others,
            accessToken,    
            
        })
    }
} catch (error) {
 
    return res.status(500).json(error)
}
}
module.exports = {
    loginCustomer,
    registerCustomer,
}