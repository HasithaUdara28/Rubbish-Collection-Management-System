import mongoose from "mongoose";

const driverSchema = mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
        },
        location:{
            type:String,
            required:true,
        }

    },
    {
        timestamps:true,
    }
);


export const Driver = mongoose.model('Driver',driverSchema);