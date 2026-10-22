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

export async function getCollectionFromSql(name: string): Promise<any[]> {
  const pool = getPgPool();
  const cleanName = name.replace(/^site_content_/, '');

  if (cleanName === 'blogPosts') {
    const res = await pool.query("SELECT * FROM blog_posts ORDER BY created_at DESC");
    return res.rows.map(r => ({
      ...r,
      featuredImage: r.featured_image,
      metaDescription: r.meta_description,
      images: typeof r.images === 'string' ? JSON.parse(r.images) : r.images || []
    }));
  }

  if (cleanName === 'journalTrends') {
    const res = await pool.query("SELECT * FROM journal_trends ORDER BY created_at DESC");
    return res.rows.map(r => ({
      ...r,
      featuredImage: r.featured_image,
      images: typeof r.images === 'string' ? JSON.parse(r.images) : r.images || []
    }));
  }

  if (cleanName === 'shopProducts') {
    const res = await pool.query("SELECT * FROM products ORDER BY created_at ASC");
    return res.rows.map(r => ({
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
  }

  if (cleanName === 'heritageItems') {
    const res = await pool.query("SELECT * FROM heritage_items ORDER BY created_at ASC");
    return res.rows;
  }

  if (cleanName === 'methodologySteps') {
    const res = await pool.query("SELECT * FROM methodology_steps ORDER BY step_order ASC, created_at ASC");
    return res.rows.map(r => ({ ...r, stepOrder: r.step_order }));
  }

  if (cleanName === 'brideGallery') {
    const res = await pool.query("SELECT * FROM bride_gallery ORDER BY created_at ASC");
    return res.rows.map(r => ({
      ...r,
      images: typeof r.images === 'string' ? JSON.parse(r.images) : r.images || []
    }));
  }

  return [];
}

export async function saveCollectionToSql(name: string, items: any[]): Promise<{ success: boolean }> {
  const pool = getPgPool();
  const cleanName = name.replace(/^site_content_/, '');

  if (cleanName === 'blogPosts') {
    const ids = items.map(it => it.id).filter(Boolean);
    for (const p of items) {
      await saveBlogPostToSql(p);
    }
    if (ids.length > 0) {
      await pool.query("DELETE FROM blog_posts WHERE NOT (id = ANY($1))", [ids]);
    }
    return { success: true };
  }

  if (cleanName === 'journalTrends') {
    const ids = items.map(it => it.id).filter(Boolean);
    for (const t of items) {
      const id = t.id || `trend_${Date.now()}`;
      await pool.query(
        `INSERT INTO journal_trends (id, title, date, excerpt, content, image, featured_image, images)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id) DO UPDATE SET title = $2, date = $3, excerpt = $4, content = $5, image = $6, featured_image = $7, images = $8`,
        [
          id,
          t.title || "Trends",
          t.date || "",
          t.excerpt || "",
          t.content || "",
          t.image || "",
          t.featuredImage || t.image || "",
          JSON.stringify(t.images || [])
        ]
      );
    }
    if (ids.length > 0) {
      await pool.query("DELETE FROM journal_trends WHERE NOT (id = ANY($1))", [ids]);
    }
    return { success: true };
  }

  if (cleanName === 'shopProducts') {
    const ids = items.map(it => it.id).filter(Boolean);
    for (const pr of items) {
      const id = pr.id || `product_${Date.now()}`;
      await pool.query(
        `INSERT INTO products (id, name, price, category, description, long_description, image, angles, metal_weight, diamond_weight, polki_weight, metal_quality, diamond_quality, colour_stone_weight, available_metals, available_sizes, details)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
         ON CONFLICT (id) DO UPDATE SET name = $2, price = $3, category = $4, description = $5, long_description = $6, image = $7, angles = $8`,
        [
          id,
          pr.name || pr.title || "Product",
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
    if (ids.length > 0) {
      await pool.query("DELETE FROM products WHERE NOT (id = ANY($1))", [ids]);
    }
    return { success: true };
  }

  if (cleanName === 'heritageItems') {
    const ids = items.map(it => it.id).filter(Boolean);
    for (const h of items) {
      const id = h.id || `heritage_${Date.now()}`;
      await pool.query(
        `INSERT INTO heritage_items (id, title, era, year, description, materials, image)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO UPDATE SET title = $2, era = $3, year = $4, description = $5, materials = $6, image = $7`,
        [id, h.title || "", h.era || "", h.year || "", h.description || "", h.materials || "", h.image || ""]
      );
    }
    if (ids.length > 0) {
      await pool.query("DELETE FROM heritage_items WHERE NOT (id = ANY($1))", [ids]);
    }
    return { success: true };
  }

  if (cleanName === 'methodologySteps') {
    const ids = items.map(it => it.id).filter(Boolean);
    for (let idx = 0; idx < items.length; idx++) {
      const m = items[idx];
      const id = m.id || `step_${Date.now()}_${idx}`;
      const stepOrder = typeof m.stepOrder === 'number' && m.stepOrder > 0 ? m.stepOrder : (idx + 1);
      await pool.query(
        `INSERT INTO methodology_steps (id, title, subtitle, text, detail, image, step_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO UPDATE SET title = $2, subtitle = $3, text = $4, detail = $5, image = $6, step_order = $7`,
        [id, m.title || "", m.subtitle || "", m.text || "", m.detail || "", m.image || "", stepOrder]
      );
    }
    if (ids.length > 0) {
      await pool.query("DELETE FROM methodology_steps WHERE NOT (id = ANY($1))", [ids]);
    }
    return { success: true };
  }

  if (cleanName === 'brideGallery') {
    const ids = items.map(it => it.id).filter(Boolean);
    for (const b of items) {
      const id = b.id || `bride_${Date.now()}`;
      await pool.query(
        `INSERT INTO bride_gallery (id, name, story, description, image, images)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO UPDATE SET name = $2, story = $3, description = $4, image = $5, images = $6`,
        [id, b.name || "", b.story || "", b.description || "", b.image || "", JSON.stringify(b.images || [])]
      );
    }
    if (ids.length > 0) {
      await pool.query("DELETE FROM bride_gallery WHERE NOT (id = ANY($1))", [ids]);
    }
    return { success: true };
  }

  return { success: true };
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

  // 1. Merge with existing site_global data
  let existingData = {};
  try {
    const existingRes = await pool.query("SELECT data FROM site_global WHERE id = 'global'");
    if (existingRes.rows.length > 0 && existingRes.rows[0].data) {
      existingData = existingRes.rows[0].data;
    }
  } catch (err) {}

  const mergedGlobal = { ...existingData, ...globalFields };

  // Update site_global with merged data
  await pool.query(
    "INSERT INTO site_global (id, data, updated_at) VALUES ('global', $1, NOW()) ON CONFLICT (id) DO UPDATE SET data = $1, updated_at = NOW()",
    [JSON.stringify(mergedGlobal)]
  );

  // Update collections if provided
  if (Array.isArray(shopProducts)) {
    await saveCollectionToSql('shopProducts', shopProducts);
  }
  if (Array.isArray(heritageItems)) {
    await saveCollectionToSql('heritageItems', heritageItems);
  }
  if (Array.isArray(methodologySteps)) {
    await saveCollectionToSql('methodologySteps', methodologySteps);
  }
  if (Array.isArray(brideGallery)) {
    await saveCollectionToSql('brideGallery', brideGallery);
  }
  if (Array.isArray(journalTrends)) {
    await saveCollectionToSql('journalTrends', journalTrends);
  }
  if (Array.isArray(blogPosts)) {
    await saveCollectionToSql('blogPosts', blogPosts);
  }

  return { success: true };
}

export async function saveBlogPostToSql(post: any) {
  const pool = getPgPool();
  const id = post.id || `post_${Date.now()}`;
  const slug = post.title ? post.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") : id;

  let gallery = Array.isArray(post.images)
    ? post.images
    : (typeof post.images === 'string' ? JSON.parse(post.images || '[]') : []);

  let primaryImg = post.image || "";
  let featuredImg = post.featuredImage || primaryImg || "";

  // Prioritize custom uploaded image (data URL or local) over placeholder Unsplash
  if (gallery.length > 0 && gallery[0] && (gallery[0].startsWith("data:") || gallery[0].startsWith("/"))) {
    if (!primaryImg || primaryImg.includes("unsplash.com")) {
      primaryImg = gallery[0];
    }
    if (!featuredImg || featuredImg.includes("unsplash.com")) {
      featuredImg = gallery[0];
    }
  }

  if (primaryImg && (primaryImg.startsWith("data:") || primaryImg.startsWith("/")) && (!gallery || gallery.length === 0)) {
    gallery = [primaryImg];
  }

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
      primaryImg,
      featuredImg || primaryImg,
      JSON.stringify(gallery),
      post.published !== false,
      post.author || "Shekar Menon",
      post.metaDescription || ""
    ]
  );
  return { success: true, id };
}
