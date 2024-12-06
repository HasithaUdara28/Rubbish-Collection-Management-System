import express from 'express';
import { Driver } from '../models/driverModel.js';
const router = express.Router();

router.post('/',async(request,response)=>{
    try{
        if(
            !request.body.name||
            !request.body.location
        ){
            return response.status(400).send({
                message:'Send all required field: name ,location'
            })
        }const newDriver={
            name:request.body.name,
            location:request.body.location,
        }
        const driver = await Driver.create(newDriver);

        return response.status(201).send(driver);
    }catch(error){
        console.log(error.message);
        response.status(500).send({message:error.message});
    }
})

router.get('/',async(request,response)=>{
    try{
        const drivers = await Driver.find({});

        return response.status(200).json(drivers);
    }catch(error){
        console.log(error.message);
        response.status(500).send({message:error.message});
    }
})

router.get('/:id',async(request,response)=>{
    try{
        const {id} = request.params;

        const drivers = await Driver.findById(id);

        return response.status(200).json(drivers);
    }catch(error){
        console.log(error.message);
        response.status(500).send({message:error.message});
    }
})

router.put('/:id',async(request,response)=>{
    try{
        if(
            !request.body.name||
            !request.body.location
        ){
            return response.status(400).send({
                message:'Send all required field: name ,location'
            })
        }
        const {id} = request.params;

        const result = await Driver.findByIdAndUpdate(id,request.body);

        if(!result){
            return response.status(404).json({message: 'Driver not found'})
        }
        return response.status(200).send({message:'Driver update successfully'})
    }catch(error){
        console.log(error.message);
        response.status(500).send({message:error.message});
    }
})

router.delete('/:id',async(request,response)=>{
    try{
        const {id} = request.params;

        const result = await Driver.findByIdAndDelete(id);

        if(!result){
            return response.status(404).json({message: 'Driver not found'})
        }
        return response.status(200).send({message:'Driver Deleted Successfully'})
    }catch(error){
        console.log(error.message);
        response.status(500).send({message:error.message});
    }
})

export default router;