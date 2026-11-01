import { Suspense, useEffect, useMemo, useState } from 'react'
import { Routes, Route, Link, NavLink, useParams, useNavigate } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, OrbitControls, Stars } from '@react-three/drei'
import { motion } from 'framer-motion'
import { ArrowRight, Menu, X, Code2, Smartphone, Megaphone, Glasses, Box, Palette, CheckCircle2, Upload, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react'
import axios from 'axios'
import { services, portfolio, articles, jobs } from './data'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const icons = { Code2, Smartphone, Megaphone, Glasses, Box, Palette }

function Ecosystem({ compact=false }) {
  const group = useMemo(() => null, [])
  return (
    <Canvas camera={{ position:[0,0,6], fov:42 }} dpr={[1, compact ? 1.25 : 1.75]} gl={{ antialias:true, alpha:true }}>
      <ambientLight intensity={0.45} /><pointLight position={[4,4,4]} intensity={22} color="#d4af37" />
      <Stars radius={35} depth={18} count={compact ? 350 : 750} factor={2} saturation={0} fade speed={0.5} />
      <Float speed={1.4} rotationIntensity={0.55} floatIntensity={0.8}>
        <mesh rotation={[0.4,-0.3,0.1]}>
          <icosahedronGeometry args={[1.65,1]} /><meshStandardMaterial color="#111111" metalness={0.85} roughness={0.22} wireframe />
        </mesh>
      </Float>
      {[[-2.7,-1.25,0],[2.35,-1.5,-0.4],[-2.1,1.45,-0.2],[2.55,1.25,0.2],[0,2.05,-0.5]].map((p,i)=>(
        <Float key={i} speed={1+i*.1} floatIntensity={.7}>
          <mesh position={p}><octahedronGeometry args={[.22,0]} /><meshStandardMaterial color="#d4af37" metalness={.9} roughness={.18} /></mesh>
        </Float>
      ))}
      <Environment preset="city" />
      {!compact && <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.55} />}
    </Canvas>
  )
}

function Layout({children}) {
  const [open,setOpen] = useState(false)
  const nav = [['Services','/services'],['Portfolio','/portfolio'],['About','/about'],['Blog','/blog'],['Careers','/careers']]
  return <>
    <header className="nav"><Link className="brand" to="/"><span>R</span> RIYADVI</Link>
      <button className="menu-button" onClick={()=>setOpen(!open)} aria-label="Toggle navigation">{open?<X/>:<Menu/>}</button>
      <nav className={open?'open':''}>{nav.map(([n,p])=><NavLink key={p} to={p} onClick={()=>setOpen(false)}>{n}</NavLink>)}</nav>
      <Link className="nav-cta" to="/contact">Start a Project <ArrowRight size={16}/></Link>
    </header>
    <main>{children}</main>
    <footer><div><Link className="brand" to="/"><span>R</span> RIYADVI</Link><p>Technology. Design. Growth.</p></div><div><b>Explore</b><Link to="/services">Services</Link><Link to="/portfolio">Portfolio</Link><Link to="/about">About</Link></div><div><b>Connect</b><Link to="/contact">Contact</Link><Link to="/careers">Careers</Link><Link to="/admin/login">Admin</Link></div><div><b>Assessment</b><Link to="/business-health-checkup">Business Health Check</Link><Link to="/software-project-planning-guide">Planning Guide</Link></div></footer>
  </>
}

const SectionTitle = ({eyebrow,title,text}) => <div className="section-title"><span>{eyebrow}</span><h2>{title}</h2>{text&&<p>{text}</p>}</div>

function Page({children,className=''}) { return <div className={`page ${className}`}>{children}</div> }

function Home() {
  return <Page className="home">
    <section className="hero">
      <div className="hero-copy"><motion.span initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>TECHNOLOGY • DESIGN • GROWTH</motion.span><motion.h1 initial={{opacity:0,y:25}} animate={{opacity:1,y:0}} transition={{delay:.12}}>Custom Software &amp;<br/><em>Digital Solutions</em><br/>to Grow Your Business.</motion.h1><motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.25}}>Web &amp; App Development, UI/UX Design, and Business Strategy – all tailored to your needs.</motion.p><motion.div className="hero-actions" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.35}}><Link className="primary" to="/contact">Book a Free Consultation <ArrowRight size={18}/></Link><Link className="secondary" to="/services">Explore Our Solutions</Link></motion.div></div>
      <div className="hero-3d"><Ecosystem /></div>
    </section>
    <section className="proof"><div><strong>Since 2021</strong><span>Building digital futures</span></div><div><strong>End-to-End</strong><span>Strategy to scale</span></div><div><strong>Human-first</strong><span>Technology partners</span></div></section>
    <section className="services-section"><SectionTitle eyebrow="01 / EXPERTISE" title="Technology that moves business forward."/><div className="service-grid">{services.map((s,i)=>{const Icon=icons[s.icon];return <Link className="service-card" to={`/services/${s.slug}`} key={s.slug}><span>0{i+1}</span><Icon/><h3>{s.title}</h3><p>{s.description}</p><ArrowRight/></Link>})}</div></section>
    <section className="why"><div className="why-visual"><Ecosystem compact /></div><div><SectionTitle eyebrow="WHY RIYADVI" title="Built with clarity. Delivered with precision."/><ul>{['Business-first strategy','Premium design craftsmanship','Scalable engineering architecture','Long-term partnership mindset'].map(x=><li key={x}><CheckCircle2/> {x}</li>)}</ul><Link className="text-link" to="/about">Discover our approach <ArrowRight size={17}/></Link></div></section>
    <section className="process"><SectionTitle eyebrow="THE JOURNEY" title="One connected growth engine."/><div className="process-line">{['Strategy','Design','Development','Marketing','Optimization','Growth'].map((x,i)=><div key={x}><b>0{i+1}</b><span>{x}</span></div>)}</div></section>
    <section className="cta-panel"><div><span>YOUR NEXT CHAPTER</span><h2>Have an ambitious idea?</h2></div><Link className="primary" to="/contact">Let's build it <ArrowRight/></Link></section>
  </Page>
}

function Services() {
  return <Page><div className="inner"><SectionTitle eyebrow="OUR EXPERTISE" title="Solutions designed for meaningful impact."/><div className="service-grid">{services.map((s,i)=>{const Icon=icons[s.icon];return <Link className="service-card" to={`/services/${s.slug}`} key={s.slug}><span>0{i+1}</span><Icon/><h3>{s.title}</h3><p>{s.description}</p><ArrowRight/></Link>})}</div></div></Page>
}

function ServiceDetail() {
  const {slug}=useParams(); const s=services.find(x=>x.slug===slug)
  if(!s) return <NotFound/>
  const Icon=icons[s.icon]
  return <Page><section className="detail-hero"><div><span>{s.eyebrow}</span><h1>{s.title}</h1><p>{s.description}</p><Link className="primary" to="/contact">Discuss your project <ArrowRight/></Link></div><div className="detail-3d"><Ecosystem compact/></div></section><section className="inner split"><div><h2>What we deliver</h2><p>We combine strategy, design and engineering to create a solution that is useful today and ready for tomorrow.</p></div><div className="feature-list">{s.features.map(x=><div key={x}><CheckCircle2/><span>{x}</span></div>)}</div></section></Page>
}

function Portfolio() { return <Page><div className="inner"><SectionTitle eyebrow="SELECTED WORK" title="Proof, not promises."/><div className="portfolio-grid">{portfolio.map(p=><Link to={`/portfolio/${p.slug}`} className="portfolio-card" key={p.slug}><div className="portfolio-art"><Ecosystem compact/></div><span>{p.category}</span><h3>{p.title}</h3><p>{p.summary}</p><b>{p.metric}</b></Link>)}</div></div></Page>}
function PortfolioDetail(){const {slug}=useParams();const p=portfolio.find(x=>x.slug===slug);if(!p)return <NotFound/>;return <Page><section className="detail-hero portfolio-detail"><div><span>{p.category}</span><h1>{p.title}</h1><p>{p.summary}</p><b className="metric">{p.metric}</b></div><div className="detail-3d"><Ecosystem/></div></section><section className="inner split"><div><span className="eyebrow">THE CHALLENGE</span><h2>Connect the experience.</h2></div><p>Riyadvi unified research, product strategy, UX design and scalable engineering into one outcome-led delivery model.</p></section></Page>}

function About(){return <Page><div className="inner"><SectionTitle eyebrow="ABOUT RIYADVI" title="Since 2021, building technology with purpose."/><section className="timeline">{['2021','2023','2024','2026'].map((year,i)=><motion.div key={year} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}><span>{year}</span><b>{['Riyadvi established','Digital product practice','Immersive technology lab','Global transformation partner'][i]}</b></motion.div>)}</section><section className="why about-why"><div className="why-visual"><Ecosystem compact/></div><div><h2>Technology should create business momentum.</h2><p>We unite strategy, design, engineering and growth into a connected partnership.</p></div></section></div></Page>}

function Blog(){return <Page><div className="inner"><SectionTitle eyebrow="INSIGHTS" title="Ideas for the digital frontier."/><div className="article-grid">{articles.map(a=><Link to={`/blog/${a.slug}`} className="article-card" key={a.slug}><span>{a.category} • {a.date}</span><h3>{a.title}</h3><p>{a.excerpt}</p><b>Read article <ArrowRight size={16}/></b></Link>)}</div></div></Page>}
function BlogDetail(){const {slug}=useParams();const a=articles.find(x=>x.slug===slug);if(!a)return <NotFound/>;return <Page><article className="article"><span>{a.category} • {a.date}</span><h1>{a.title}</h1><p className="lead">{a.excerpt}</p><p>Digital transformation succeeds when technology decisions are tied to clear customer and commercial outcomes. The strongest organizations replace disconnected projects with a connected product strategy.</p><h2>A practical point of view</h2><p>Start with the business constraint, validate the user need, choose the smallest valuable release, then build a scalable foundation. This creates momentum without accumulating avoidable technical debt.</p></article></Page>}

function Careers(){return <Page><div className="inner"><SectionTitle eyebrow="CAREERS" title="Build meaningful things with ambitious people."/><div className="job-list">{jobs.map(j=><Link to={`/careers/${j.slug}`} className="job-card" key={j.slug}><div><h3>{j.title}</h3><p>{j.location} • {j.type}</p></div><ArrowRight/></Link>)}</div></div></Page>}
function CareerDetail(){const {slug}=useParams();const j=jobs.find(x=>x.slug===slug);if(!j)return <NotFound/>;return <Page><section className="detail-hero"><div><span>{j.location} • {j.type}</span><h1>{j.title}</h1><p>{j.summary}</p></div></section><ApplicationForm slug={slug}/></Page>}

function submitForm(url,data){return axios.post(`${API}${url}`,data,{headers:typeof data==='object'&&!data.hasOwnProperty('file')?{'Content-Type':'application/json'}:undefined})}

function Contact(){const [status,setStatus]=useState('');async function onSubmit(e){e.preventDefault();const fd=new FormData(e.currentTarget);const values=Object.fromEntries(fd);try{if(values.service==='Free Consultation')await submitForm('/consultation',{name:values.name,email:values.email,company:values.company,service:values.service,phone:'',message:values.message});else await submitForm('/contact',values);setStatus(values.service==='Free Consultation'?'Your free consultation request has been received.':'Thanks. Our team will contact you shortly.');e.currentTarget.reset()}catch(err){setStatus(err.response?.data?.message||'Unable to submit. Please try again.')}}return <Page><div className="inner form-layout"><div><SectionTitle eyebrow="CONTACT" title="Let's create something valuable."/><p className="muted">Tell us about your ambition, challenge or next milestone.</p><div className="contact-lines"><span><Mail/> hello@riyadvi.com</span><span><Phone/> +91 00000 00000</span><span><MapPin/> India • Serving globally</span></div></div><form className="form-card" onSubmit={onSubmit}><div className="field-row"><label>Name<input name="name" required/></label><label>Email<input name="email" type="email" required/></label></div><label>Company<input name="company"/></label><label>Service<select name="service"><option>Free Consultation</option><option>Web Development</option><option>App Development</option><option>Digital Marketing</option><option>AR / VR</option><option>3D Modeling</option><option>UI/UX Design</option></select></label><label>Message<textarea name="message" required rows="5"/></label><button className="primary" type="submit">Send enquiry <ArrowRight/></button>{status&&<p className="form-status">{status}</p>}</form></div></Page>}

function BusinessHealth(){const [step,setStep]=useState(0);const [answers,setAnswers]=useState({});const [status,setStatus]=useState('');const steps=['Business Information','Digital Presence','Marketing','Technology','Challenges','Submission'];const update=e=>setAnswers({...answers,[e.target.name]:e.target.value});const score=Object.entries(answers).filter(([k,v])=>k.startsWith('rating')&&Number(v)).reduce((sum,[,v])=>sum+Number(v),0);const max=Object.keys(answers).filter(k=>k.startsWith('rating')).length*5||1;const percent=Math.round(score/max*100);async function submit(e){e.preventDefault();try{await submitForm('/health-checkup',{...answers,healthScore:percent});setStatus(`Assessment submitted. Your digital health score is ${percent}/100.`)}catch(err){setStatus(err.response?.data?.message||'Unable to submit assessment.')}}return <Page><div className="inner assessment"><SectionTitle eyebrow="BUSINESS HEALTH CHECKUP" title="Is Your Business Ready for Its Next Digital Growth Stage?"/><div className="stepper">{steps.map((x,i)=><button className={i===step?'active':''} onClick={()=>setStep(i)} key={x}><b>{i+1}</b><span>{x}</span></button>)}</div>{status?<div className="score-card"><b>{percent}</b><span>Digital health score</span><p>{status}</p><Link to="/contact">Plan my next move</Link></div>:<form className="form-card assessment-form" onSubmit={submit}>
{step===0&&<><label>Company name<input name="company" onChange={update} required/></label><label>Industry<input name="industry" onChange={update}/></label><label>Business stage<select name="stage" onChange={update}><option>Starting</option><option>Growing</option><option>Scaling</option><option>Established</option></select></label></>}
{[1,2,3].includes(step)&&<><label>{['Website & digital presence','Marketing performance','Technology maturity'][step-1]}<select name={`rating${step}`} onChange={update}><option value="">Select maturity level</option><option value="1">Needs significant improvement</option><option value="2">Basic</option><option value="3">Developing</option><option value="4">Strong</option><option value="5">Market leading</option></select></label></>}
{step===4&&<label>Primary business challenges<textarea name="challenges" onChange={update} rows="5"/></label>}
{step===5&&<><div className="field-row"><label>Name<input name="name" onChange={update} required/></label><label>Email<input name="email" type="email" onChange={update} required/></label></div></>}
<div className="step-actions">{step>0&&<button type="button" className="secondary" onClick={()=>setStep(step-1)}>Back</button>}{step<5?<button type="button" className="primary" onClick={()=>setStep(step+1)}>Continue <ArrowRight/></button>:<button className="primary">Calculate & submit</button>}</div></form>}</div></Page>}

function PlanningGuide(){const [status,setStatus]=useState('');async function submit(e){e.preventDefault();const d=Object.fromEntries(new FormData(e.currentTarget));try{await submitForm('/lead-magnet',d);setStatus('Your planning guide is ready. Check your inbox for the next step.');e.currentTarget.reset()}catch(err){setStatus(err.response?.data?.message||'Unable to submit.')}}return <Page><div className="inner guide"><div><SectionTitle eyebrow="FREE RESOURCE" title="Software Project Planning Guide"/><p>Move from idea to execution with a practical framework covering scope, budget, delivery and risk.</p><ul>{['Scope definition worksheet','Technology decision framework','Milestone planning checklist'].map(x=><li key={x}><CheckCircle2/> {x}</li>)}</ul></div><form className="form-card" onSubmit={submit}><label>Name<input name="name" required/></label><label>Company<input name="company" required/></label><label>Email<input name="email" type="email" required/></label><label>Phone<input name="phone" required/></label><button className="primary">Download the guide <ArrowRight/></button>{status&&<p className="form-status">{status}</p>}</form></div></Page>}

function ApplicationForm({slug}){const [status,setStatus]=useState('');async function submit(e){e.preventDefault();const fd=new FormData(e.currentTarget);fd.append('position',slug);try{await axios.post(`${API}/applications`,fd,{headers:{'Content-Type':'multipart/form-data'}});setStatus('Application received. Thank you for your interest.');e.currentTarget.reset()}catch(err){setStatus(err.response?.data?.message||'Unable to submit application.')}}return <form className="form-card application-form" onSubmit={submit}><div className="field-row"><label>Name<input name="name" required/></label><label>Email<input name="email" type="email" required/></label></div><label>LinkedIn / Portfolio<input name="portfolio"/></label><label>Resume<input name="resume" type="file" accept=".pdf,.doc,.docx" required/></label><label>Why Riyadvi?<textarea name="coverLetter" rows="5" required/></label><button className="primary">Submit application <ArrowRight/></button>{status&&<p className="form-status">{status}</p>}</form>}

function AdminLogin(){const navigate=useNavigate();const [status,setStatus]=useState('');async function submit(e){e.preventDefault();const d=Object.fromEntries(new FormData(e.currentTarget));try{const {data}=await axios.post(`${API}/admin/login`,d);localStorage.setItem('riyadvi_token',data.token);navigate('/admin')}catch(err){setStatus(err.response?.data?.message||'Login failed')}}return <Page><div className="login-wrap"><form className="form-card login-card" onSubmit={submit}><ShieldCheck/><h2>Admin portal</h2><label>Email<input name="email" type="email" required/></label><label>Password<input name="password" type="password" required/></label><button className="primary">Sign in</button>{status&&<p className="form-status">{status}</p>}</form></div></Page>}
function LegacyAdmin(){const [stats,setStats]=useState(null);const [error,setError]=useState('');useEffect(()=>{const token=localStorage.getItem('riyadvi_token');if(!token){setError('Please sign in to view the dashboard.');return}axios.get(`${API}/admin/stats`,{headers:{Authorization:`Bearer ${token}`}}).then(r=>setStats(r.data.data)).catch(e=>setError(e.response?.data?.message||'Unable to load dashboard'))},[]);return <Page><div className="inner admin"><div className="admin-head"><SectionTitle eyebrow="SECURE DASHBOARD" title="Submission overview"/><button className="secondary" onClick={()=>{localStorage.removeItem('riyadvi_token');window.location.href='/admin/login'}}>Sign out</button></div>{error?<div className="form-status">{error} <Link to="/admin/login">Go to login</Link></div>:stats?<div className="stats-grid">{Object.entries(stats).map(([k,v])=><div key={k}><span>{k.replace(/([A-Z])/g,' $1')}</span><b>{v}</b></div>)}</div>:<p>Loading live submissions...</p>}</div></Page>}
function Admin(){
  const [stats,setStats]=useState(null)
  const [submissions,setSubmissions]=useState(null)
  const [error,setError]=useState('')
  useEffect(()=>{
    const token=localStorage.getItem('riyadvi_token')
    if(!token){setError('Please sign in to view the dashboard.');return}
    const headers={Authorization:`Bearer ${token}`}
    Promise.all([
      axios.get(`${API}/admin/stats`,{headers}),
      axios.get(`${API}/admin/submissions`,{headers})
    ]).then(([statsResponse,submissionResponse])=>{
      setStats(statsResponse.data.data)
      setSubmissions(submissionResponse.data.data)
    }).catch(err=>setError(err.response?.data?.message||'Unable to load dashboard'))
  },[])
  return <Page><div className="inner admin">
    <div className="admin-head"><SectionTitle eyebrow="SECURE DASHBOARD" title="Submission overview"/><button className="secondary" onClick={()=>{localStorage.removeItem('riyadvi_token');window.location.href='/admin/login'}}>Sign out</button></div>
    {error?<div className="form-status">{error} <Link to="/admin/login">Go to login</Link></div>:stats?<>
      <div className="stats-grid">{Object.entries(stats).map(([k,v])=><div key={k}><span>{k.replace(/([A-Z])/g,' $1')}</span><b>{v}</b></div>)}</div>
      <section className="admin-table-wrap"><h2>Latest enquiries</h2><div className="admin-table">{submissions?.contacts.map(item=><div className="admin-row" key={item._id}><b>{item.name}</b><span>{item.email}</span><span>{item.phone||'-'}</span><span>{item.company||'-'}</span><span>{item.message||item.service||'-'}</span><span>{new Date(item.createdAt).toLocaleDateString()}</span><em>{item.status||'New'}</em></div>)}</div></section>
      <section className="admin-table-wrap"><h2>Applications &amp; consultations</h2><div className="admin-table">{[...(submissions?.consultations||[]),...(submissions?.applications||[])].map(item=><div className="admin-row" key={item._id}><b>{item.name}</b><span>{item.email}</span><span>{item.phone||'-'}</span><span>{item.company||item.position||'-'}</span><span>{item.message||item.coverLetter||'-'}</span><span>{new Date(item.createdAt).toLocaleDateString()}</span><em>{item.status||'New'}</em></div>)}</div></section>
    </>:<p>Loading live submissions...</p>}
  </div></Page>
}

function NotFound(){return <Page><div className="inner not-found"><h1>404</h1><p>This page is outside our current digital orbit.</p><Link className="primary" to="/">Return home</Link></div></Page>}

export default function App(){return <Layout><Routes><Route path="/" element={<Home/>}/><Route path="/services" element={<Services/>}/><Route path="/services/:slug" element={<ServiceDetail/>}/><Route path="/portfolio" element={<Portfolio/>}/><Route path="/portfolio/:slug" element={<PortfolioDetail/>}/><Route path="/about" element={<About/>}/><Route path="/blog" element={<Blog/>}/><Route path="/blog/:slug" element={<BlogDetail/>}/><Route path="/careers" element={<Careers/>}/><Route path="/careers/:slug" element={<CareerDetail/>}/><Route path="/contact" element={<Contact/>}/><Route path="/business-health-checkup" element={<BusinessHealth/>}/><Route path="/software-project-planning-guide" element={<PlanningGuide/>}/><Route path="/admin/login" element={<AdminLogin/>}/><Route path="/admin" element={<Admin/>}/><Route path="*" element={<NotFound/>}/></Routes></Layout>}
