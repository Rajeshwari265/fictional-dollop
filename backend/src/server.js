import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import mongoose from 'mongoose'
import multer from 'multer'
import path from 'node:path'
import fs from 'node:fs'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import models from './models.js'

const app = express()
app.use(helmet({ crossOriginResourcePolicy:false }))
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials:true }))
app.use(express.json({ limit:'1mb' }))

const uploadDir = path.resolve('uploads')
fs.mkdirSync(uploadDir,{recursive:true})
const upload = multer({dest:uploadDir,limits:{fileSize:5*1024*1024},fileFilter:(req,file,cb)=>cb(null,/\.pdf$|\.doc$|\.docx$/i.test(file.originalname))})

async function save(Model,body,extra={}) {
  if (mongoose.connection.readyState !== 1) throw Object.assign(new Error('Database is not connected. Configure MONGODB_URI in backend/.env.'),{status:503})
  return Model.create({...body,...extra})
}
const ok=(res,data,status=201)=>res.status(status).json({success:true,data})
const validate=(schema)=>(req,res,next)=>{const result=schema.safeParse(req.body);if(!result.success)return res.status(400).json({success:false,message:'Please check the submitted fields.',errors:result.error.flatten()});req.valid=result.data;next()}
const email=z.string().email()

app.get('/api/health',(req,res)=>res.json({success:true,status:'ok',database:mongoose.connection.readyState===1?'connected':'disconnected',timestamp:new Date().toISOString()}))
app.post('/api/contact',validate(z.object({name:z.string().min(2),email,company:z.string().optional(),service:z.string().optional(),message:z.string().min(10)})),async(req,res,next)=>{try{ok(res,await save(models.Contact,req.valid))}catch(e){next(e)}})
app.post('/api/consultation',validate(z.object({name:z.string().min(2),email,phone:z.string().optional(),company:z.string().optional(),service:z.string().optional(),message:z.string().optional()})),async(req,res,next)=>{try{ok(res,await save(models.Consultation,req.valid))}catch(e){next(e)}})
app.post('/api/health-checkup',validate(z.object({company:z.string().optional(),industry:z.string().optional(),stage:z.string().optional(),challenges:z.string().optional(),name:z.string().optional(),email:z.string().email().optional(),rating1:z.coerce.number().min(1).max(5).optional(),rating2:z.coerce.number().min(1).max(5).optional(),rating3:z.coerce.number().min(1).max(5).optional(),healthScore:z.coerce.number().min(0).max(100).optional()})),async(req,res,next)=>{try{ok(res,await save(models.HealthCheck,req.valid))}catch(e){next(e)}})
app.post('/api/lead-magnet',validate(z.object({name:z.string().min(2),company:z.string().min(2),email,phone:z.string().min(7)})),async(req,res,next)=>{try{ok(res,await save(models.LeadMagnet,req.valid))}catch(e){next(e)}})
app.post('/api/applications',upload.single('resume'),async(req,res,next)=>{
  const schema=z.object({name:z.string().min(2),email,portfolio:z.string().optional(),coverLetter:z.string().min(10),position:z.string().min(2)})
  const result=schema.safeParse(req.body);if(!result.success||!req.file){return res.status(400).json({success:false,message:result.success?'Resume file is required':'Please check the submitted fields.',errors:result.success?undefined:result.error.flatten()})}
  try{ok(res,await save(models.Application,{...result.data,resumeUrl:`/uploads/${req.file.filename}`}))}
  catch(e){next(e)}
})
app.use('/uploads',express.static(uploadDir))

app.post('/api/admin/login',async(req,res)=>{
  const schema=z.object({email:z.string().email(),password:z.string().min(1)})
  const result=schema.safeParse(req.body);if(!result.success)return res.status(400).json({success:false,message:'Invalid login fields.'})
  const {email,password}=result.data
  if(!process.env.ADMIN_EMAIL||!process.env.ADMIN_PASSWORD||!process.env.JWT_SECRET)return res.status(503).json({success:false,message:'Admin credentials are not configured. Add values to backend/.env.'})
  if(email!==process.env.ADMIN_EMAIL||password!==process.env.ADMIN_PASSWORD)return res.status(401).json({success:false,message:'Invalid email or password.'})
  const token=jwt.sign({role:'admin',email},process.env.JWT_SECRET,{expiresIn:'8h'})
  res.json({success:true,token})
})
function requireAdmin(req,res,next){try{const token=req.headers.authorization?.replace(/^Bearer\s+/,'');if(!token||!process.env.JWT_SECRET)return res.status(401).json({success:false,message:'Authentication required.'});const payload=jwt.verify(token,process.env.JWT_SECRET);if(payload.role!=='admin')throw new Error();next()}catch(err){return res.status(401).json({success:false,message:'Invalid or expired session.'})}}
app.get('/api/admin/stats',requireAdmin,async(req,res,next)=>{try{if(mongoose.connection.readyState!==1)return res.status(503).json({success:false,message:'Database is not connected.'});const [contacts,consultations,health,leads,applications]=await Promise.all([models.Contact.countDocuments(),models.Consultation.countDocuments(),models.HealthCheck.countDocuments(),models.LeadMagnet.countDocuments(),models.Application.countDocuments()]);ok(res,{totalEnquiries:contacts,consultationRequests:consultations,healthCheckupLeads:health,leadMagnetLeads:leads,jobApplications:applications},200)}catch(e){next(e)}})
app.get('/api/admin/submissions',requireAdmin,async(req,res,next)=>{try{if(mongoose.connection.readyState!==1)return res.status(503).json({success:false,message:'Database is not connected.'});const [contacts,consultations,health,leads,applications]=await Promise.all([models.Contact.find().sort({createdAt:-1}).lean(),models.Consultation.find().sort({createdAt:-1}).lean(),models.HealthCheck.find().sort({createdAt:-1}).lean(),models.LeadMagnet.find().sort({createdAt:-1}).lean(),models.Application.find().sort({createdAt:-1}).lean()]);ok(res,{contacts,consultations,healthCheckups:health,leadMagnets:leads,applications},200)}catch(e){next(e)}})
app.use((req,res)=>res.status(404).json({success:false,message:'API route not found.'}))
app.use((err,req,res,next)=>{console.error(err);res.status(err.status||500).json({success:false,message:err.message||'An unexpected server error occurred.'})})

const port=process.env.PORT||5000
async function start(){if(process.env.MONGODB_URI){try{await mongoose.connect(process.env.MONGODB_URI,{serverSelectionTimeoutMS:5000});console.log('MongoDB connected')}catch(err){console.error('MongoDB connection failed:',err.message)}}else console.warn('MONGODB_URI is not set. API submissions will be unavailable until configured.');app.listen(port,()=>console.log(`Riyadvi API listening at http://localhost:${port}`))}
start()
