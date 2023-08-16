import mongoose from 'mongoose'
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
    try {
       // await mongoose.connect("mongodb://localhost/merndb");
       /*await mongoose.connect("mongodb+srv://root:root@cluster0.rwie7xo.mongodb.net/merndb?retryWrites=true&w=majority");*/
       await mongoose.connect(process.env.MONGO_URI);
       console.log(">>> DB is connected")
    } catch (error){
        console.log(error);
    }
};

