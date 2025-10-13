-- Add click tracking counter to restaurant_recommendations
ALTER TABLE restaurant_recommendations 
ADD COLUMN total_clicks integer NOT NULL DEFAULT 0;