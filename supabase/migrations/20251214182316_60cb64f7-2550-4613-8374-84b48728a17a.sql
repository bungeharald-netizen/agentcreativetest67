-- Create analyses table to store saved analyses
CREATE TABLE public.analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  company_type TEXT,
  challenges TEXT,
  goals TEXT,
  current_processes TEXT,
  suggestions JSONB NOT NULL DEFAULT '[]',
  action_plan JSONB NOT NULL DEFAULT '[]',
  roi_estimate JSONB NOT NULL DEFAULT '{}',
  company_info JSONB NOT NULL DEFAULT '{}',
  agent_conversation JSONB,
  total_roi_percentage INTEGER,
  total_investment INTEGER,
  suggestions_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (public access for now - no auth)
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Anyone can view analyses" 
ON public.analyses 
FOR SELECT 
USING (true);

-- Create policy for public insert access
CREATE POLICY "Anyone can create analyses" 
ON public.analyses 
FOR INSERT 
WITH CHECK (true);

-- Create policy for public delete access
CREATE POLICY "Anyone can delete analyses" 
ON public.analyses 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_analyses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_analyses_updated_at
BEFORE UPDATE ON public.analyses
FOR EACH ROW
EXECUTE FUNCTION public.update_analyses_updated_at();