import mongoose from "mongoose";
import { log } from "util";

type ConnectionObject = {
    isConnected?:number
}

const connection:ConnectionObject={}
async function dbConnect(): Promise<void>{
    if(connection.isConnected){
        console.log("Already connected ");
        return
        
    }
    try {
        const db =  await mongoose.connect(process.env.MONGO_URL || '',{})
        console.log(db);
        connection.isConnected = db.connections[0].readyState;
        console.log("DB connected Successfully");
        
        
        
    } catch (error) {
        console.log("Database connection failed ");
        process.exit(1);
        
        
    }


}
export default dbConnect