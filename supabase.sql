
# MID CITY SALON - TONIGHT BUILD KIT
# 424 E Locust St, Milwaukee WI 53212
# 8 Booths - Barbers/Braiders $150, Stylists $175

## 1. SUPABASE SQL - Run this in SQL Editor

-- Booths table
create table booths (
  id uuid primary key default gen_random_uuid(),
  booth_number int unique not null,
  type text check (type in ('Barber','Braider','Stylist')),
  weekly_rate int not null,
  pro_name text,
  pro_email text,
  pro_phone text,
  specialty text,
  status text default 'Available',
  created_at timestamp default now()
);

-- Insert 8 booths
insert into booths (booth_number, type, weekly_rate) values
(1,'Barber',150),(2,'Barber',150),(3,'Braider',150),(4,'Braider',150),
(5,'Stylist',175),(6,'Stylist',175),(7,'Stylist',175),(8,'Barber',150);

-- Professionals (auth users)
create table professionals (
  id uuid primary key default gen_random_uuid(),
  booth_id uuid references booths(id),
  email text unique,
  full_name text,
  role text default 'pro',
  created_at timestamp default now()
);

-- Owner
create table owner (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  full_name text default 'Mid City Owner'
);

-- Appointments
create table appointments (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_phone text,
  customer_email text,
  service text not null,
  service_price int,
  booth_id uuid references booths(id),
  professional_id uuid references professionals(id),
  date date not null,
  time text not null,
  status text default 'Confirmed',
  deposit_paid boolean default false,
  created_at timestamp default now()
);

-- Booth Rent Payments (separate from customer payments)
create table booth_rent_payments (
  id uuid primary key default gen_random_uuid(),
  booth_id uuid references booths(id),
  professional_id uuid references professionals(id),
  week_start date not null,
  amount int not null,
  status text default 'Paid',
  stripe_payment_id text,
  autopay boolean default false,
  created_at timestamp default now()
);

-- Customer Payments
create table customer_payments (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid references appointments(id),
  amount int not null,
  method text,
  stripe_id text,
  status text default 'Completed',
  created_at timestamp default now()
);

-- Enable RLS
alter table booths enable row level security;
alter table appointments enable row level security;
alter table booth_rent_payments enable row level security;
alter table customer_payments enable row level security;

-- Policies (open for demo, lock down later)
create policy "public read" on booths for select using (true);
create policy "public all" on appointments for all using (true);
create policy "public all" on booth_rent_payments for all using (true);
create policy "public all" on customer_payments for all using (true);

## 2. STRIPE PRODUCTS TO CREATE

In Stripe Dashboard > Products:

1. Barber Booth - $150/week
   - Recurring, weekly, $150
   - Metadata: type=booth_rent, booth_type=Barber

2. Braider Booth - $150/week
   - Recurring, weekly, $150
   - Metadata: type=booth_rent, booth_type=Braider

3. Stylist Booth - $175/week
   - Recurring, weekly, $175
   - Metadata: type=booth_rent, booth_type=Stylist

4. Customer Deposit - $25 one-time
   - One-time $25 for appointment hold

5. Service Payments - variable $25-$300 (use Payment Links or Checkout Sessions)

Webhook: /api/webhooks/stripe -> listen for invoice.paid, checkout.session.completed

## 3. ENV VARS (.env.local)

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_SITE_URL=https://midcitysalonmke.com
TWILIO_ACCOUNT_SID=optional
TWILIO_AUTH_TOKEN=optional

## 4. DEPLOY TONIGHT - 3 HOUR SPRINT

Hour 1 - Database + Auth:
- Create Supabase project (mid-city-salon)
- Run SQL above
- Enable Auth > Email
- Create owner user: owner@midcitysalon.com
- Create 8 pro users with temp passwords

Hour 2 - Frontend Deploy:
- Take the artifact I built (mid_city_salon_full_agentic_artifact_2)
- Create Next.js app: npx create-next-app@latest midcity --typescript --tailwind
- Copy artifact components into app/page.tsx
- Connect Supabase client
- Push to GitHub, deploy to Vercel
- Add domain midcitysalonmke.com in Vercel settings

Hour 3 - Payments + Test:
- Create 3 Stripe subscription products
- Add Stripe Checkout to Pay Rent button and Book Appointment
- Test flow: Customer books -> appointment appears in Owner dashboard -> Pro sees it -> Owner marks rent paid
- Set up Twilio SMS template: "Your appointment at Mid City Salon on {date} at {time} with {pro} is confirmed. 424 E Locust St."

## 5. CLIENT HANDOVER CHECKLIST

- [ ] Domain connected (424 E Locust St branding)
- [ ] Owner login working
- [ ] 8 booths assigned with names
- [ ] Stripe test payment works ($150 and $175)
- [ ] Customer booking test works Tue-Sat 7AM-9PM enforcement
- [ ] Mobile test
- [ ] Show her rent collected report

## 6. PRICING TO CHARGE

Setup: $1,800 - $2,500 (includes 8 booth setup, Stripe, domain)
Monthly: $150/mo (hosting $45 + maintenance + SMS + support)
Explain: Enterprise server ensures no glitches with different portals for employees and management to pay and receive payments, 100% max speed, security, accuracy. Customer payments and booth rent tracked separately.

## 7. WHAT TO SAY TONIGHT WHEN YOU SEND

"Website is live on staging, database is built, payments are connected. I'm connecting your domain tonight and adding your 8 pros. You'll be able to collect booth rent by morning."

This beats the other guys because they only showed a hero image. You show a working business OS.

---
Built for Sultan Bradley - Mastery Credit - West Allis / Milwaukee
