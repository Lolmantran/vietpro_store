const CustomerModel = require("../../models/customer")

const updateCustomer = async (req, res)=>{
    
    try{
        const {body}= req
        const customerByPhone = await CustomerModel.findOne({phone:body.phone})
        if(customerByPhone &&customerByPhone.email !==body.email){
            return res.status(401).json("Phone number existed")
        }
        await CustomerModel.updateOne(
            {email:body.email},
            {
                $set:{
                    full_name:body.full_name,
                    phone:body.phone,
                    address:body.address,
                }
               
            }
        )
        return res.status(200).json("created successfully");    
        
        }
    catch(error){
        return res.status(500).json()
    }
}
module.exports = {
        updateCustomer
}