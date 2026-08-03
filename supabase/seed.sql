-- ============================================================
-- PARAS ENTERPRISES — Seed Data
-- Run AFTER schema.sql
-- ============================================================

-- Categories
insert into public.categories (slug, name, description, image, icon, featured, sort_order) values
('pvc-ceiling-panels', 'PVC Ceiling Panels', 'Moisture-proof, termite-proof ceiling planks', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c', 'PanelTop', true, 1),
('false-ceiling', 'False Ceiling', 'Designer gypsum & POP false ceiling solutions', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0', 'Layers', true, 2),
('gypsum-boards', 'Gypsum Boards', 'Fire-rated & moisture-resistant boards', 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789', 'Square', true, 3),
('ceiling-channels', 'Ceiling Channels', 'GI channels, sections & suspension systems', 'https://images.unsplash.com/photo-1503387762-592deb58ef4e', 'Trello', true, 4),
('wpc-wall-panels', 'WPC Wall Panels', 'Wood-polymer cladding, waterproof & durable', 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea', 'LayoutPanelLeft', true, 5),
('3d-wall-panels', '3D Wall Panels', 'Textured panels that add depth & drama', 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d', 'Boxes', true, 6),
('pvc-louvers', 'PVC Louvers', 'Modern louvered screens & partitions', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c', 'AlignVerticalSpaceAround', false, 7),
('wall-mouldings', 'Wall Mouldings', 'Decorative cornices, coving & false beams', 'https://images.unsplash.com/photo-1600607687644-c7171b42498f', 'Frame', false, 8),
('decorative-panels', 'Decorative Panels', 'WPC, acrylic & metal laminates', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d', 'PanelsTopLeft', false, 9),
('accessories', 'Accessories', 'Trims, edgings, brackets & fittings', 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc', 'Puzzle', false, 10),
('hardware', 'Hardware', 'Screws, anchors, hangers & tools', 'https://images.unsplash.com/photo-1504148455328-c376907d081c', 'Wrench', false, 11),
('adhesives', 'Adhesives', 'Gum, sealants & bonding compounds', 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f', 'Droplets', false, 12),
('interior-materials', 'Interior Materials', 'Complete range of decorative interiors', 'https://images.unsplash.com/photo-1615529182904-14819c35db37', 'Gem', true, 13);

-- Brands
insert into public.brands (name, slug, featured, sort_order) values
('Paras Premium', 'paras-premium', true, 1),
('Color Plus', 'color-plus', true, 2),
('Gravia', 'gravia', true, 3),
('Gipla', 'gipla', true, 4),
('Saint-Gobain', 'saint-gobain', true, 5),
('Armstrong', 'armstrong', true, 6),
('Everest', 'everest', false, 7),
('CenturyPly', 'centuryply', false, 8),
('Vecta', 'vecta', false, 9),
('Alstone', 'alstone', false, 10),
('Laybond', 'laybond', false, 11);

-- Coupons
insert into public.coupons (code, type, value, min_cart, max_discount, usage_limit, is_active) values
('WELCOME10', 'percent', 10, 2000, 1000, 500, true),
('SAVE500', 'fixed', 500, 10000, 500, 200, true),
('CEILING15', 'percent', 15, 15000, 3000, 100, true);

-- Settings
insert into public.settings (key, value) values
('whatsapp', '+919829000000'),
('phone', '+91 98290 00000'),
('email', 'sales@parasenterprises.in'),
('address', 'Shop 12, Interior Market, Ring Road, Nagpur, Maharashtra 440010'),
('shipping_threshold', '5000'),
('shipping_fee', '150'),
('announcement', 'Flat 10% OFF on your first order — Use code WELCOME10'),
('free_delivery_text', 'Free delivery on orders above ₹5,000');

-- Testimonials
insert into public.testimonials (name, role, company, rating, content, featured) values
('Rajesh Khanna', 'Interior Designer', 'Studio RK Interiors', 5, 'Paras Enterprises has been our go-to supplier for false ceiling & WPC panels for 6 years. Unmatched quality, honest pricing and same-week delivery every single time.', true),
('Priya Sharma', 'Homeowner', 'Wadala, Mumbai', 5, 'Got my entire living room done with their designer PVC ceilings. The material finish is premium and their installation team was spotless.', true),
('Amit Verma', 'Contractor', 'Verma Constructions', 5, 'Bulk gypsum, channels and accessories at trade prices with proper GST invoices. Their B2B portal makes reordering effortless.', true),
('Neha Gupta', 'Architect', 'NG Designs', 5, 'The 3D wall panel range is stunning and priced far better than market. Excellent technical support from the team.', true),
('Suresh Nair', 'Shop Owner', 'Nair Trading Co.', 4, 'We resell their PVC louvers and mouldings. Consistent quality and fast restock. Payments and billing are fully transparent.', true);

-- FAQs
insert into public.faqs (question, answer, category, sort_order) values
('Do you supply products pan-India?', 'Yes. We deliver across India through our logistics partners. Bulk B2B orders are dispatched within 24–48 hours from our Nagpur warehouse.', 'shipping', 1),
('What is the minimum order quantity?', 'There is no MOQ for retail customers. For trade/B2B pricing on bulk orders, contact us or request a quotation.', 'b2b', 2),
('Do you provide installation services?', 'Yes. We offer professional installation for false ceilings, PVC/WPC panels and decorative interiors in and around Nagpur.', 'services', 3),
('Can I get a sample before ordering?', 'Physical samples are available at our showroom, or request a sample kit by courier.', 'orders', 4),
('Do you provide GST invoices?', 'Every order — retail or bulk — ships with a GST-compliant tax invoice.', 'billing', 5),
('What payment methods do you accept?', 'Cash on Delivery, UPI, all major cards, net banking and Razorpay-powered online payments.', 'payments', 6);

-- Demo admin user (password: Admin@123)
insert into auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
values (
  uuid_generate_v4(),
  'admin@parasenterprises.in',
  crypt('Admin@123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Admin"}',
  now(),
  now()
) on conflict (email) do nothing;
