import mongoose from 'mongoose'
const timestamps={timestamps:true,versionKey:false}
const Contact=mongoose.models.Contact||mongoose.model('Contact',new mongoose.Schema({name:{type:String,required:true},email:{type:String,required:true},company:String,service:String,message:{type:String,required:true},phone:String,status:{type:String,default:'New',enum:['New','Contacted','Closed']}},timestamps))
const Consultation=mongoose.models.Consultation||mongoose.model('Consultation',new mongoose.Schema({name:String,email:String,phone:String,company:String,service:String,message:String,status:{type:String,default:'New',enum:['New','Contacted','Closed']}},timestamps))
const HealthCheck=mongoose.models.HealthCheck||mongoose.model('HealthCheck',new mongoose.Schema({company:String,industry:String,stage:String,challenges:String,name:String,email:String,rating1:Number,rating2:Number,rating3:Number,healthScore:Number,status:{type:String,default:'New',enum:['New','Contacted','Closed']}},timestamps))
const LeadMagnet=mongoose.models.LeadMagnet||mongoose.model('LeadMagnet',new mongoose.Schema({name:String,company:String,email:String,phone:String},timestamps))
const Application=mongoose.models.Application||mongoose.model('Application',new mongoose.Schema({name:String,email:String,portfolio:String,coverLetter:String,position:String,resumeUrl:String},timestamps))
export default {Contact,Consultation,HealthCheck,LeadMagnet,Application}
