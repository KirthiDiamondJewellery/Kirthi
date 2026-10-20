import { Pool } from 'pg';

let pgPool: Pool | null = null;

export function getPgPool(): Pool {
  if (!pgPool) {
    pgPool = new Pool({
      host: process.env.SQL_HOST,
      user: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
      database: process.env.SQL_DB_NAME,
      max: 10,
      connectionTimeoutMillis: 10000,
    });
    pgPool.on('error', (err) => {
      console.error('Unexpected error on idle PostgreSQL client:', err);
    });
  }
  return pgPool;
}

export async function fetchFullContentFromSql() {
  const pool = getPgPool();
  
  // 1. Fetch site_global
  let globalData: any = {};
  try {
    const globalRes = await pool.query("SELECT data FROM site_global WHERE id = 'global'");
    if (globalRes.rows.length > 0 && globalRes.rows[0].data) {
      globalData = globalRes.rows[0].data;
    }
  } catch (err) {
    console.warn("Could not read site_global:", err);
  }

  // 2. Fetch blog posts
  let blogPosts: any[] = [];
  try {
    const postsRes = await pool.query("SELECT * FROM blog_posts ORDER BY created_at DESC");
    blogPosts = postsRes.rows.map(r => ({
      ...r,
      featuredImage: r.featured_image,
      metaDescription: r.meta_description,
      images: typeof r.images === 'string' ? JSON.parse(r.images) : r.images || []
    }));
  } catch (err) {
    console.warn("Could not read blog_posts:", err);
  }

  // 3. Fetch journal trends
  let journalTrends: any[] = [];
  try {
    const trendsRes = await pool.query("SELECT * FROM journal_trends ORDER BY created_at DESC");
    journalTrends = trendsRes.rows.map(r => ({
      ...r,
      featuredImage: r.featured_image,
      images: typeof r.images === 'string' ? JSON.parse(r.images) : r.images || []
    }));
  } catch (err) {
    console.warn("Could not read journal_trends:", err);
  }

  // 4. Fetch products
  let shopProducts: any[] = [];
  try {
    const prodRes = await pool.query("SELECT * FROM products ORDER BY created_at ASC");
    shopProducts = prodRes.rows.map(r => ({
      ...r,
      longDescription: r.long_description,
      metalWeight: r.metal_weight,
      diamondWeight: r.diamond_weight,
      polkiWeight: r.polki_weight,
      metalQuality: r.metal_quality,
      diamondQuality: r.diamond_quality,
      colourStoneWeight: r.colour_stone_weight,
      angles: typeof r.angles === 'string' ? JSON.parse(r.angles) : r.angles || [],
      availableMetals: typeof r.available_metals === 'string' ? JSON.parse(r.available_metals) : r.available_metals || [],
      availableSizes: typeof r.available_sizes === 'string' ? JSON.parse(r.available_sizes) : r.available_sizes || [],
      details: typeof r.details === 'string' ? JSON.parse(r.details) : r.details || []
    }));
  } catch (err) {
    console.warn("Could not read products:", err);
  }

  // 5. Fetch heritage items
  let heritageItems: any[] = [];
  try {
    const herRes = await pool.query("SELECT * FROM heritage_items ORDER BY created_at ASC");
    heritageItems = herRes.rows;
  } catch (err) {
    console.warn("Could not read heritage_items:", err);
  }

  // 6. Fetch methodology steps
  let methodologySteps: any[] = [];
  try {
    const methRes = await pool.query("SELECT * FROM methodology_steps ORDER BY step_order ASC, created_at ASC");
    methodologySteps = methRes.rows.map(r => ({
      ...r,
      stepOrder: r.step_order
    }));
  } catch (err) {
    console.warn("Could not read methodology_steps:", err);
  }

  // 7. Fetch bride gallery
  let brideGallery: any[] = [];
  try {
    const brideRes = await pool.query("SELECT * FROM bride_gallery ORDER BY created_at ASC");
    brideGallery = brideRes.rows.map(r => ({
      ...r,
      images: typeof r.images === 'string' ? JSON.parse(r.images) : r.images || []
    }));
  } catch (err) {
    console.warn("Could not read bride_gallery:", err);
  }

  return {
    ...globalData,
    blogPosts,
    journalTrends,
    shopProducts,
    heritageItems,
    methodologySteps,
    brideGallery,
  };
}

export async function saveGlobalContentToSql(newContent: any) {
  const pool = getPgPool();
  const {
    blogPosts,
    journalTrends,
    shopProducts,
    heritageItems,
    methodologySteps,
    brideGallery,
    ...globalFields
  } = newContent;

  // Update site_global
  await pool.query(
    "INSERT INTO site_global (id, data, updated_at) VALUES ('global', $1, NOW()) ON CONFLICT (id) DO UPDATE SET data = $1, updated_at = NOW()",
    [JSON.stringify(globalFields)]
  );

  // Update collections if provided
  if (Array.isArray(shopProducts)) {
    for (const pr of shopProducts) {
      if (!pr.id) continue;
      await pool.query(
        `INSERT INTO products (id, name, price, category, description, long_description, image, angles, metal_weight, diamond_weight, polki_weight, metal_quality, diamond_quality, colour_stone_weight, available_metals, available_sizes, details)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
         ON CONFLICT (id) DO UPDATE SET name = $2, price = $3, category = $4, description = $5, long_description = $6, image = $7, angles = $8`,
        [
          pr.id,
          pr.name || "Product",
          pr.price || 0,
          pr.category || "",
          pr.description || "",
          pr.longDescription || "",
          pr.image || "",
          JSON.stringify(pr.angles || []),
          String(pr.metalWeight || ""),
          String(pr.diamondWeight || ""),
          String(pr.polkiWeight || ""),
          pr.metalQuality || "",
          pr.diamondQuality || "",
          String(pr.colourStoneWeight || ""),
          JSON.stringify(pr.availableMetals || []),
          JSON.stringify(pr.availableSizes || []),
          JSON.stringify(pr.details || [])
        ]
      );
    }
  }

  if (Array.isArray(heritageItems)) {
    for (const h of heritageItems) {
      if (!h.id) continue;
      await pool.query(
        `INSERT INTO heritage_items (id, title, era, year, description, materials, image)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO UPDATE SET title = $2, era = $3, year = $4, description = $5, materials = $6, image = $7`,
        [h.id, h.title || "", h.era || "", h.year || "", h.description || "", h.materials || "", h.image || ""]
      );
    }
  }

  return { success: true };
}

export async function saveBlogPostToSql(post: any) {
  const pool = getPgPool();
  const id = post.id || `post_${Date.now()}`;
  const slug = post.title ? post.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") : id;

  await pool.query(
    `INSERT INTO blog_posts (id, title, slug, date, excerpt, content, image, featured_image, images, published, author, meta_description)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
     ON CONFLICT (id) DO UPDATE SET title = $2, slug = $3, date = $4, excerpt = $5, content = $6, image = $7, featured_image = $8, images = $9, published = $10, author = $11, meta_description = $12`,
    [
      id,
      post.title || "Untitled",
      slug,
      post.date || "",
      post.excerpt || "",
      post.content || "",
      post.image || "",
      post.featuredImage || post.image || "",
      JSON.stringify(post.images || []),
      post.published !== false,
      post.author || "Shekar Menon",
      post.metaDescription || ""
    ]
  );
  return { success: true, id };
}
