-- Create Customers table
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE,
    role TEXT DEFAULT 'customer', -- 'customer' or 'trainer'
    name TEXT,
    age NUMERIC,
    weight NUMERIC,
    premium BOOLEAN DEFAULT false,
    sessions NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Reservations table
CREATE TABLE IF NOT EXISTS public.reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    date TEXT NOT NULL, -- Format: YYYY-MM-DD
    time_slot TEXT NOT NULL, -- Format: HH:00
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Settings table
CREATE TABLE IF NOT EXISTS public.settings (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert initial time range settings
INSERT INTO public.settings (key, value)
VALUES ('time_range', '{"startHour": 8, "endHour": 20, "maxReservationsPerSlot": 1}')
ON CONFLICT (key) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (Simulated for development. In production, use authenticated role)
CREATE POLICY "Allow public read-write for customers" ON public.customers FOR ALL USING (true);
CREATE POLICY "Allow public read-write for reservations" ON public.reservations FOR ALL USING (true);
CREATE POLICY "Allow public read-write for settings" ON public.settings FOR ALL USING (true);
