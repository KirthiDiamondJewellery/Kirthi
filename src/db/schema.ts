import { pgTable, text, serial, timestamp, integer, boolean, jsonb } from 'drizzle-orm/pg-core';

// Users table (Firebase Auth UID mapping)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  role: text('role').default('specialist'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Global Site Configuration (branding, rates, contact, philosophy, etc.)
export const siteGlobal = pgTable('site_global', {
  id: text('id').primaryKey(), // 'global'
  data: jsonb('data').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Blog Posts / Journal Articles
export const blogPosts = pgTable('blog_posts', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug'),
  date: text('date'),
  excerpt: text('excerpt'),
  content: text('content'),
  image: text('image'),
  featuredImage: text('featured_image'),
  images: jsonb('images'),
  published: boolean('published').default(true),
  author: text('author').default('Shekar Menon'),
  metaDescription: text('meta_description'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Journal Trends Reports
export const journalTrends = pgTable('journal_trends', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  date: text('date'),
  excerpt: text('excerpt'),
  content: text('content'),
  image: text('image'),
  featuredImage: text('featured_image'),
  images: jsonb('images'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Boutique Products
export const products = pgTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  price: integer('price').default(0),
  category: text('category'),
  description: text('description'),
  longDescription: text('long_description'),
  image: text('image'),
  angles: jsonb('angles'),
  metalWeight: text('metal_weight'),
  diamondWeight: text('diamond_weight'),
  polkiWeight: text('polki_weight'),
  metalQuality: text('metal_quality'),
  diamondQuality: text('diamond_quality'),
  colourStoneWeight: text('colour_stone_weight'),
  availableMetals: jsonb('available_metals'),
  availableSizes: jsonb('available_sizes'),
  details: jsonb('details'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Heritage Archive
export const heritageItems = pgTable('heritage_items', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  era: text('era'),
  year: text('year'),
  description: text('description'),
  materials: text('materials'),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Savoir Faire / Methodology Steps
export const methodologySteps = pgTable('methodology_steps', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  text: text('text'),
  detail: text('detail'),
  image: text('image'),
  stepOrder: integer('step_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// Patron Bridal Showcase Gallery
export const brideGallery = pgTable('bride_gallery', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  story: text('story'),
  description: text('description'),
  image: text('image'),
  images: jsonb('images'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Client Orders
export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  orderId: text('order_id'),
  customerName: text('customer_name'),
  customerEmail: text('customer_email'),
  customerPhone: text('customer_phone'),
  items: jsonb('items'),
  totalAmount: integer('total_amount'),
  status: text('status').default('pending'),
  paymentDetails: jsonb('payment_details'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Consultations / Bespoke Inquiries
export const consultations = pgTable('consultations', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  date: text('date'),
  location: text('location'),
  notes: text('notes'),
  status: text('status').default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
});
