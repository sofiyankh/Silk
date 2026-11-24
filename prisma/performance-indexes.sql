-- Performance indexes for Silk Streetwear (Supabase PostgreSQL)
-- Run manually in Supabase SQL Editor. Do NOT auto-execute during build.

-- Product listing & storefront queries
CREATE INDEX IF NOT EXISTS idx_product_published_created
  ON "Product" ("isPublished", "createdAt" DESC);

-- Product relations
CREATE INDEX IF NOT EXISTS idx_variant_product_id
  ON "Variant" ("productId");

CREATE INDEX IF NOT EXISTS idx_product_image_product_position
  ON "ProductImage" ("productId", "position");

-- Orders & admin dashboard queries
CREATE INDEX IF NOT EXISTS idx_order_created_at
  ON "Order" ("createdAt" DESC);

CREATE INDEX IF NOT EXISTS idx_order_status
  ON "Order" ("status");

CREATE INDEX IF NOT EXISTS idx_order_user_id
  ON "Order" ("userId");

-- Cart lookups
CREATE INDEX IF NOT EXISTS idx_cart_item_cart_id
  ON "CartItem" ("cartId");

