-- Create bonus_transactions table for tracking bonus operations
CREATE TABLE public.bonus_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- positive = credit, negative = debit
  balance_after INTEGER NOT NULL,
  note TEXT NOT NULL,
  created_by TEXT NOT NULL, -- email of admin or host who created the transaction
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast history lookup by guest
CREATE INDEX idx_bonus_transactions_guest 
ON public.bonus_transactions(guest_id, created_at DESC);

-- Enable RLS
ALTER TABLE public.bonus_transactions ENABLE ROW LEVEL SECURITY;

-- Admin can see and manage all bonus transactions
CREATE POLICY "Admin can manage bonus transactions"
ON public.bonus_transactions
FOR ALL
USING (true);

-- Hosts can view bonus transactions of their guests only
CREATE POLICY "Hosts can view their guests bonus transactions"
ON public.bonus_transactions
FOR SELECT
USING (
  guest_id IN (
    SELECT DISTINCT g.id 
    FROM public.guests g
    JOIN public.bookings b ON b.guest_email = g.email
    JOIN public.rooms r ON b.room_id = r.id
    WHERE r.host_email = current_setting('request.jwt.claims', true)::json->>'email'
  )
);

-- Guests can view their own bonus history (for future guest portal)
CREATE POLICY "Guests can view their own bonus history"
ON public.bonus_transactions
FOR SELECT
USING (
  guest_id IN (
    SELECT id FROM public.guests 
    WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
  )
);