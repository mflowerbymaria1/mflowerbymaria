-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Products Table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    short_description TEXT,
    description TEXT,
    category TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 3,
    image_url TEXT,
    gallery JSONB DEFAULT '[]',
    is_best_seller BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    postal_code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id),
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_status TEXT DEFAULT 'pending', -- pending, approved, rejected, cancelled
    shipping_status TEXT DEFAULT 'pending', -- pending, ready_to_pack, packed, shipped, delivered
    payment_method TEXT, -- mercadopago, transferencia
    mercadopago_id TEXT,
    shipping_method TEXT,
    shipping_cost DECIMAL(10, 2) DEFAULT 0,
    shipping_address JSONB,
    tracking_number TEXT,
    label_url TEXT, -- Link a la etiqueta de Envía
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Abandoned Carts Table
CREATE TABLE IF NOT EXISTS abandoned_carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_email TEXT NOT NULL,
    items JSONB NOT NULL, -- [{product_id, quantity, name, price}]
    last_active TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    email_sent BOOLEAN DEFAULT false
);

-- STOCK MANAGEMENT TRIGGER
-- Function to decrease stock when an order is approved
CREATE OR REPLACE FUNCTION handle_stock_on_payment() 
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.payment_status = 'approved' AND OLD.payment_status != 'approved') THEN
        UPDATE products
        SET stock = stock - items.quantity
        FROM (
            SELECT product_id, quantity 
            FROM order_items 
            WHERE order_id = NEW.id
        ) AS items
        WHERE products.id = items.product_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_payment_approved
    AFTER UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION handle_stock_on_payment();

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE products;
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE order_items;
