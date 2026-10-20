
'use client'
import { useState, useEffect } from 'react'

type Booth = { id: number, type: 'Barber'|'Braider'|'Stylist', rate: number, pro: string, status: 'Available'|'Rented' }
type Appt = { id: string, customer: string, service: string, pro: string, booth: number, date: string, time: string, status: 'Confirmed'|'Pending', price: number }

const BOOTHS: Booth[] = [
  { id: 1, type: 'Barber', rate: 150, pro: 'Jake Cuts', status: 'Rented' },
  { id: 2, type: 'Braider', rate: 150, pro: 'Aaliyah Braids', status: 'Rented' },
  { id: 3, type: 'Barber', rate: 150, pro: 'Marcus Styles', status: 'Rented' },
  { id: 4, type: 'Braider', rate: 150, pro: 'Keisha Kinks', status: 'Available' },
  { id: 5, type: 'Stylist', rate: 175, pro: 'Tasha Glam', status: 'Rented' },
  { id: 6, type: 'Stylist', rate: 175, pro: 'Imani Hair', status: 'Rented' },
  { id: 7, type: 'Stylist', rate: 175, pro: 'Jordan Luxe', status: 'Rented' },
  { id: 8, type: 'Barber', rate: 150, pro: 'Open Booth', status: 'Available' },
]

const SERVICES = [
  { name: 'Haircuts', price: '$35-60' },
  { name: 'Hair Styles', price: '$65-120' },
  { name: 'Braids', price: '$120-300' },
  { name: 'Facials', price: '$50-90' },
  { name: 'Waxing', price: '$25-70' },
  { name: 'Foot Soak', price: '$30' },
  { name: 'Reflexology', price: '$60' },
]

export default function Page() {
  const [mode, setMode] = useState<'customer'|'pro'|'owner'>('customer')
  const [appts, setAppts] = useState<Appt[]>(()=>{
    if(typeof window !== 'undefined'){ const s = localStorage.getItem('midcity_appts'); if(s) return JSON.parse(s) }
    return [
      { id: '1', customer: 'Olivia Harper', service: 'Braids', pro: 'Aaliyah Braids', booth: 2, date: '2026-10-20', time: '9:00 AM', status: 'Confirmed', price: 180 },
      { id: '2', customer: 'Marcus Lee', service: 'Haircuts', pro: 'Jake Cuts', booth: 1, date: '2026-10-20', time: '10:30 AM', status: 'Confirmed', price: 45 },
    ]
  })
  const [selectedPro, setSelectedPro] = useState<Booth>(BOOTHS[0])
  const [showBooking, setShowBooking] = useState(false)
  const [form, setForm] = useState({ customer: '', service: 'Braids', pro: 'Aaliyah Braids', date: '', time: '9:00 AM' })

  useEffect(()=>{ localStorage.setItem('midcity_appts', JSON.stringify(appts)) }, [appts])

  const rentCollected = BOOTHS.filter(b=>b.status==='Rented').length * 150 + 75 // approx
  const book = () => {
    const booth = BOOTHS.find(b=>b.pro===form.pro) || BOOTHS[1]
    const newAppt: Appt = { id: Date.now().toString(), customer: form.customer || 'Walk-in', service: form.service, pro: form.pro, booth: booth.id, date: form.date || new Date().toISOString().split('T')[0], time: form.time, status: 'Confirmed', price: 100 }
    setAppts([...appts, newAppt])
    setShowBooking(false)
    alert(`Booked! ${form.customer} with ${form.pro} - Confirmation SMS will send.`)
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0A0A0A]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0A0A0A] text-white border-b border-[#D4AF6A]/20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-[#D4AF6A] flex items-center justify-center font-serif font-bold text-[#D4AF6A]">MC</div>
            <span className="font-semibold tracking-widest text-sm">MID CITY SALON</span>
            <span className="hidden md:inline text-xs text-white/50 ml-6">424 E Locust St • Milwaukee • Tue-Sat 7AM-9PM</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex bg-white/10 rounded-full p-1">
              <button onClick={()=>setMode('customer')} className={`px-4 py-1.5 rounded-full text-xs ${mode==='customer'?'bg-[#D4AF6A] text-black':'text-white/70'}`}>Customer Site</button>
              <button onClick={()=>setMode('pro')} className={`px-4 py-1.5 rounded-full text-xs ${mode==='pro'?'bg-[#D4AF6A] text-black':'text-white/70'}`}>Pro Portal</button>
              <button onClick={()=>setMode('owner')} className={`px-4 py-1.5 rounded-full text-xs ${mode==='owner'?'bg-[#D4AF6A] text-black':'text-white/70'}`}>Owner Dashboard</button>
            </div>
            <button onClick={()=>setShowBooking(true)} className="bg-[#D4AF6A] text-black px-5 py-2 rounded-full text-sm font-medium">Book Appointment</button>
          </div>
        </div>
        <div className="md:hidden flex bg-black border-t border-white/10">
          <button onClick={()=>setMode('customer')} className={`flex-1 py-3 text-xs ${mode==='customer'?'text-[#D4AF6A]':'text-white/60'}`}>Customer</button>
          <button onClick={()=>setMode('pro')} className={`flex-1 py-3 text-xs ${mode==='pro'?'text-[#D4AF6A]':'text-white/60'}`}>Pro</button>
          <button onClick={()=>setMode('owner')} className={`flex-1 py-3 text-xs ${mode==='owner'?'text-[#D4AF6A]':'text-white/60'}`}>Owner</button>
        </div>
      </header>

      {mode==='customer' && (
        <>
          <section className="relative h-[85vh] bg-black flex items-center overflow-hidden">
            <img src="/api/placeholder" alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1634449571010-02389ed0f357)', backgroundSize: 'cover'}} />
            <div className="relative max-w-7xl mx-auto px-6 w-full">
              <p className="text-[#D4AF6A] tracking-[0.3em] text-xs mb-6">MILWAUKEE, WI</p>
              <h1 className="text-6xl md:text-8xl font-serif leading-[0.9] text-white">Where Style<br/>Meets<br/><span className="text-[#D4AF6A]">Community</span></h1>
              <p className="text-white/60 mt-8 text-sm tracking-wide">424 E Locust St, Milwaukee, WI 53212 • Tue–Sat • 7:00 AM – 9:00 PM • (414) 899-2041</p>
              <div className="mt-10 flex gap-4">
                <button onClick={()=>setShowBooking(true)} className="bg-[#D4AF6A] text-black px-8 py-4 rounded-full font-medium">Book Appointment</button>
                <div className="text-white/50 text-xs flex items-center">8 Booths • 7 Services • Black-Owned</div>
              </div>
            </div>
          </section>

          <section className="max-w-7xl mx-auto px-6 py-20">
            <div className="flex justify-between items-end mb-10">
              <h2 className="text-4xl font-serif">Services</h2>
              <p className="text-sm text-black/50">Facials • Waxing • Foot Soak • Reflexology</p>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              {SERVICES.map(s=>(
                <div key={s.name} className="bg-white border border-black/5 rounded-2xl p-6 hover:border-[#D4AF6A]/50 transition">
                  <div className="text-xs tracking-widest text-[#D4AF6A] mb-2">{s.price}</div>
                  <h3 className="font-serif text-xl">{s.name}</h3>
                  <button onClick={()=>{setForm({...form, service: s.name}); setShowBooking(true)}} className="mt-4 text-xs underline">Book {s.name}</button>
                </div>
              ))}
              <div className="bg-[#0A0A0A] text-white rounded-2xl p-6 flex flex-col justify-between">
                <div><p className="text-[#D4AF6A] text-xs tracking-widest">BOOTH RENT</p><h3 className="font-serif text-2xl mt-2">8 Total Booths</h3></div>
                <div className="text-sm text-white/60">Barbers $150/wk • Braiders $150/wk • Stylists $175/wk • Up to $1,300/wk potential</div>
              </div>
            </div>
          </section>
        </>
      )}

      {mode==='pro' && (
        <section className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex gap-4 mb-8">
            <select value={selectedPro.pro} onChange={e=>setSelectedPro(BOOTHS.find(b=>b.pro===e.target.value) || BOOTHS[0])} className="bg-white border rounded-full px-4 py-2 text-sm">
              {BOOTHS.map(b=><option key={b.id} value={b.pro}>Booth {b.id} - {b.pro} - ${b.rate}/wk</option>)}
            </select>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border">
              <h3 className="font-serif text-xl mb-4">Today - Booth {selectedPro.id}</h3>
              {appts.filter(a=>a.pro===selectedPro.pro).map(a=>(
                <div key={a.id} className="py-3 border-b last:border-0 flex justify-between"><span>{a.time} - {a.customer} - {a.service}</span><span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{a.status}</span></div>
              ))}
              {appts.filter(a=>a.pro===selectedPro.pro).length===0 && <p className="text-sm text-black/40">No appointments today</p>}
            </div>
            <div className="bg-white rounded-2xl p-6 border">
              <h3 className="font-serif text-xl mb-4">Rent - ${selectedPro.rate}/week</h3>
              <div className="bg-[#D4AF6A]/20 rounded-xl p-4 mb-4"><p className="text-sm">Status: <b className="text-green-700">Paid This Week</b></p><p className="text-xs text-black/50 mt-1">Autopay enabled • Next due Mon</p></div>
              <button className="w-full bg-[#0A0A0A] text-white py-3 rounded-full text-sm">Pay Rent - ${selectedPro.rate}</button>
              <button className="w-full mt-2 border py-3 rounded-full text-sm">Payment History</button>
            </div>
            <div className="bg-[#0A0A0A] text-white rounded-2xl p-6">
              <h3 className="font-serif text-xl mb-4">Weekly Earnings</h3>
              <p className="text-4xl font-serif text-[#D4AF6A]">${appts.filter(a=>a.pro===selectedPro.pro).length * 75}</p>
              <p className="text-xs text-white/50 mt-2">{appts.filter(a=>a.pro===selectedPro.pro).length} appointments this week</p>
            </div>
          </div>
        </section>
      )}

      {mode==='owner' && (
        <section className="max-w-7xl mx-auto px-6 py-10">
          <div className="bg-[#D4AF6A]/20 border border-[#D4AF6A]/30 rounded-full px-4 py-2 text-xs mb-6 inline-flex">Enterprise Hosting Active - Separate portals for employees & management, encrypted payments, 100% speed, no glitches</div>
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-5 border"><p className="text-xs text-black/40">Today's Appointments</p><p className="text-3xl font-serif mt-1">{appts.length}</p></div>
            <div className="bg-[#E8F5E9] rounded-2xl p-5 border border-green-200"><p className="text-xs text-black/40">Rent Collected This Week</p><p className="text-3xl font-serif mt-1">$2,420</p><p className="text-xs text-green-700">↑ 12% this week</p></div>
            <div className="bg-[#FFF3E0] rounded-2xl p-5 border border-orange-200"><p className="text-xs text-black/40">Pending / Overdue</p><p className="text-3xl font-serif mt-1">$680</p><p className="text-xs">3 invoices due</p></div>
            <div className="bg-[#EDE7F6] rounded-2xl p-5 border"><p className="text-xs text-black/40">Occupied Booths</p><p className="text-3xl font-serif mt-1">6/8</p><p className="text-xs">75% occupancy</p></div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-2xl border p-6">
              <h3 className="font-serif text-xl mb-4">Booth Rent Tracking</h3>
              <div className="space-y-3">
                {BOOTHS.map(b=>(
                  <div key={b.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex gap-3"><span className="text-sm font-medium w-16">Booth {b.id}</span><span className="text-sm w-32">{b.pro}</span><span className="text-xs text-black/50">${b.rate}/wk • {b.type}</span></div>
                    <div className="flex gap-2"><span className={`text-xs px-2 py-1 rounded-full ${b.status==='Rented'?'bg-green-100 text-green-700':'bg-gray-100'}`}>{b.status==='Rented'?'Paid':'Available'}</span><button className="text-xs underline">Remind</button></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border p-6">
              <h3 className="font-serif text-xl mb-4">Upcoming Appointments</h3>
              <div className="space-y-3 max-h-[400px] overflow-auto">
                {appts.map(a=>(
                  <div key={a.id} className="text-sm border-b pb-2"><div className="flex justify-between"><span className="font-medium">{a.time} - {a.customer}</span><span className="text-xs bg-green-100 px-2 py-0.5 rounded-full">{a.status}</span></div><div className="text-xs text-black/50">{a.service} with {a.pro} • Booth {a.booth}</div></div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {showBooking && (
        <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-6">
          <div className="bg-white rounded-[24px] max-w-md w-full p-8">
            <div className="flex justify-between items-center mb-6"><h3 className="font-serif text-2xl">Book Appointment</h3><button onClick={()=>setShowBooking(false)} className="w-8 h-8 rounded-full bg-black/5">✕</button></div>
            <div className="space-y-4">
              <input placeholder="Your Name" value={form.customer} onChange={e=>setForm({...form, customer: e.target.value})} className="w-full border rounded-full px-4 py-3 text-sm" />
              <select value={form.service} onChange={e=>setForm({...form, service: e.target.value})} className="w-full border rounded-full px-4 py-3 text-sm">{SERVICES.map(s=><option key={s.name}>{s.name}</option>)}</select>
              <select value={form.pro} onChange={e=>setForm({...form, pro: e.target.value})} className="w-full border rounded-full px-4 py-3 text-sm">{BOOTHS.map(b=><option key={b.id} value={b.pro}>{b.pro} - Booth {b.id} - ${b.rate}/wk</option>)}</select>
              <div className="grid grid-cols-2 gap-3">
                <input type="date" value={form.date} onChange={e=>setForm({...form, date: e.target.value})} className="w-full border rounded-full px-4 py-3 text-sm" />
                <select value={form.time} onChange={e=>setForm({...form, time: e.target.value})} className="w-full border rounded-full px-4 py-3 text-sm"><option>7:00 AM</option><option>9:00 AM</option><option>10:30 AM</option><option>1:15 PM</option><option>3:00 PM</option><option>5:00 PM</option><option>7:00 PM</option></select>
              </div>
              <div className="bg-[#FAF8F5] rounded-2xl p-4 text-xs"><p>Deposit: $25 via Stripe (mock)</p><p className="text-black/50 mt-1">424 E Locust St • Tue-Sat 7AM-9PM • Separate tracking for customer payments vs booth rent</p></div>
              <button onClick={book} className="w-full bg-[#0A0A0A] text-white py-4 rounded-full font-medium">Confirm Booking - $25 Deposit</button>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-20 bg-[#0A0A0A] text-white py-10 px-6">
        <div className="max-w-7xl mx-auto flex justify-between text-xs text-white/50"><span>© Mid City Salon • 424 E Locust St Milwaukee WI 53212 • (414) 899-2041</span><span>Tue-Sat 7AM-9PM • 8 Booths • Enterprise Hosting</span></div>
      </footer>
    </div>
  )
}
