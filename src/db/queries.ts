import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import { spawn, execSync } from 'child_process';

export function ensureCloudSqlProxy(): void {
  const socketFile = "/app/cloudsql/esoteric-portal-471501-t2:asia-southeast1:ai-studio-473f78a6/.s.PGSQL.5432";
  if (fs.existsSync(socketFile)) {
    return;
  }

  try {
    const pids = execSync("pgrep -f cloud_sql_proxy || true").toString().trim();
    if (pids) {
      return;
    }
  } catch {}

  if (fs.existsSync("/app/cloud_sql_proxy")) {
    console.log("[Cloud SQL] Spawning Cloud SQL Auth Proxy watchdog...");
    try {
      const p = spawn(
        "/app/cloud_sql_proxy",
        [
          "esoteric-portal-471501-t2:asia-southeast1:ai-studio-473f78a6",
          "--unix-socket=/app/cloudsql",
          "--sql-data",
          "--sql-data-endpoint=sqladmin.googleapis.com",
          "--sqladmin-api-endpoint=sqladmin.googleapis.com"
        ],
        { detached: true, stdio: "ignore" }
      );
      p.unref();
    } catch (e) {
      console.error("[Cloud SQL] Failed to spawn proxy:", e);
    }
  }
}

export function safeParseArray(val: any): string[] {
  if (!val) return [];
  if (Array.isArray(val)) {
    return val.map(item => (typeof item === "string" ? item : JSON.stringify(item))).filter(Boolean);
  }
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map(item => (typeof item === "string" ? item : JSON.stringify(item))).filter(Boolean);
        }
      } catch {}
    }
    if (trimmed.includes(",")) {
      return trimmed.split(",").map(s => s.trim()).filter(Boolean);
    }
    return [trimmed];
  }
  return [];
}

export function getResolvedSqlHost(): string {
  if (process.env.SQL_HOST && fs.existsSync(process.env.SQL_HOST)) {
    return process.env.SQL_HOST;
  }
  for (const baseDir of ["/cloudsql", "/app/cloudsql"]) {
    if (fs.existsSync(baseDir)) {
      try {
        const entries = fs.readdirSync(baseDir);
        const instanceDir = entries.find(e => e.includes(":"));
        if (instanceDir) {
          return `${baseDir}/${instanceDir}`;
        }
      } catch {}
    }
  }
  return process.env.SQL_HOST || "/cloudsql/esoteric-portal-471501-t2:asia-southeast1:ai-studio-473f78a6";
}

export async function waitForSocket(socketDir: string, maxWaitMs = 2500): Promise<boolean> {
  const socketFile = path.join(socketDir, ".s.PGSQL.5432");
  if (fs.existsSync(socketFile)) {
    return true;
  }
  // If neither socket directory nor proxy executable exists (Cloud SQL not attached), fail fast
  if (!fs.existsSync(socketDir) && !fs.existsSync("/app/cloud_sql_proxy")) {
    return false;
  }
  ensureCloudSqlProxy();
  const startTime = Date.now();
  while (Date.now() - startTime < maxWaitMs) {
    if (fs.existsSync(socketFile)) {
      return true;
    }
    await new Promise(r => setTimeout(r, 200));
  }
  return fs.existsSync(socketFile);
}

let pgPool: Pool | null = null;

export function getPgPool(): Pool {
  if (!pgPool) {
    const host = getResolvedSqlHost();
    pgPool = new Pool({
      host,
      user: process.env.SQL_USER || "kirthi_app_user",
      password: process.env.SQL_PASSWORD,
      database: process.env.SQL_DB_NAME || "cloud_sql_development_database",
      max: 10,
      connectionTimeoutMillis: 25000,
    });
    pgPool.on('error', (err) => {
      console.error('Unexpected error on idle PostgreSQL client:', err);
      pgPool = null;
    });
  }
  return pgPool;
}

export async function executeSql<T>(queryFn: (pool: Pool) => Promise<T>): Promise<T> {
  let attempt = 0;
  const maxRetries = 2;
  while (attempt < maxRetries) {
    attempt++;
    try {
      const host = getResolvedSqlHost();
      const socketReady = await waitForSocket(host, 2500);
      if (!socketReady) {
        throw new Error(`ENOENT: Cloud SQL socket not active at ${path.join(host, ".s.PGSQL.5432")}`);
      }
      const pool = getPgPool();
      return await queryFn(pool);
    } catch (err: any) {
      const errMsg = String(err?.message || '');
      const errCode = String(err?.code || '');
      const isConnError = 
        errCode === 'ENOENT' ||
        errMsg.includes('ENOENT') ||
        errCode === 'ECONNREFUSED' || 
        errMsg.includes('ECONNREFUSED') ||
        errCode === 'ECONNRESET' ||
        errMsg.includes('ECONNRESET') ||
        errCode === 'ETIMEDOUT' ||
        errMsg.includes('timeout') ||
        errMsg.includes('Connection terminated') ||
        errMsg.includes('terminating connection') ||
        errCode === '57P01' ||
        errCode === '08006' ||
        errCode === '08001' ||
        errCode === '08004';

      if (isConnError && attempt < maxRetries) {
        console.warn(`[Cloud SQL] Socket/proxy reconnecting (attempt ${attempt}/${maxRetries}): ${errMsg}. Retrying in ${attempt * 1.5}s...`);
        pgPool = null;
        ensureCloudSqlProxy();
        await new Promise(r => setTimeout(r, attempt * 1500));
        continue;
      }
      throw err;
    }
  }
  throw new Error("Cloud SQL query failed after reconnect attempts");
}

export async function fetchFullContentFromSql() {
  return executeSql(async (pool) => {
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
        images: safeParseArray(r.images)
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
        images: safeParseArray(r.images)
      }));
    } catch (err) {
      console.warn("Could not read journal_trends:", err);
    }

    // 4. Fetch shop products
    let shopProducts: any[] = [];
    try {
      const productsRes = await pool.query("SELECT * FROM products ORDER BY created_at ASC");
      shopProducts = productsRes.rows.map(r => ({
        ...r,
        name: r.name || r.title || "Product",
        title: r.name || r.title || "Product",
        longDescription: r.long_description,
        metalWeight: r.metal_weight,
        diamondWeight: r.diamond_weight,
        polkiWeight: r.polki_weight,
        metalQuality: r.metal_quality,
        diamondQuality: r.diamond_quality,
        colourStoneWeight: r.colour_stone_weight,
        angles: safeParseArray(r.angles),
        availableMetals: safeParseArray(r.available_metals),
        availableSizes: safeParseArray(r.available_sizes),
        details: safeParseArray(r.details)
      }));
    } catch (err) {
      console.warn("Could not read products:", err);
    }

    // 5. Fetch heritage items
    let heritageItems: any[] = [];
    try {
      const heritageRes = await pool.query("SELECT * FROM heritage_items ORDER BY created_at ASC");
      heritageItems = heritageRes.rows;
    } catch (err) {
      console.warn("Could not read heritage_items:", err);
    }

    // 6. Fetch methodology steps
    let methodologySteps: any[] = [];
    try {
      const methodologyRes = await pool.query("SELECT * FROM methodology_steps ORDER BY step_order ASC, created_at ASC");
      methodologySteps = methodologyRes.rows.map(r => ({ ...r, stepOrder: r.step_order }));
    } catch (err) {
      console.warn("Could not read methodology_steps:", err);
    }

    // 7. Fetch bride gallery
    let brideGallery: any[] = [];
    try {
      const brideRes = await pool.query("SELECT * FROM bride_gallery ORDER BY created_at ASC");
      brideGallery = brideRes.rows.map(r => ({
        ...r,
        images: safeParseArray(r.images)
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
  });
}

export async function getCollectionFromSql(name: string): Promise<any[]> {
  return executeSql(async (pool) => {
    const cleanName = name.replace(/^site_content_/, '');

    if (cleanName === 'blogPosts') {
      const res = await pool.query("SELECT * FROM blog_posts ORDER BY created_at DESC");
      return res.rows.map(r => ({
        ...r,
        featuredImage: r.featured_image,
        metaDescription: r.meta_description,
        images: safeParseArray(r.images)
      }));
    }

    if (cleanName === 'journalTrends') {
      const res = await pool.query("SELECT * FROM journal_trends ORDER BY created_at DESC");
      return res.rows.map(r => ({
        ...r,
        featuredImage: r.featured_image,
        images: safeParseArray(r.images)
      }));
    }

    if (cleanName === 'shopProducts') {
      const res = await pool.query("SELECT * FROM products ORDER BY created_at ASC");
      return res.rows.map(r => ({
        ...r,
        name: r.name || r.title || "Product",
        title: r.name || r.title || "Product",
        longDescription: r.long_description,
        metalWeight: r.metal_weight,
        diamondWeight: r.diamond_weight,
        polkiWeight: r.polki_weight,
        metalQuality: r.metal_quality,
        diamondQuality: r.diamond_quality,
        colourStoneWeight: r.colour_stone_weight,
        angles: safeParseArray(r.angles),
        availableMetals: safeParseArray(r.available_metals),
        availableSizes: safeParseArray(r.available_sizes),
        details: safeParseArray(r.details)
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
        images: safeParseArray(r.images)
      }));
    }

    return [];
  });
}

export async function saveBlogPostToSql(post: any) {
  return executeSql(async (pool) => {
    if (!post || typeof post !== 'object') {
      return { success: false, id: null };
    }

    const id = String(post.id || `post_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`);
    const rawTitle = String(post.title || "Untitled Article").trim();
    const fallbackSlug = id.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const derivedSlug = rawTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    const slug = post.slug ? String(post.slug).trim() : (derivedSlug || fallbackSlug);

    let gallery = safeParseArray(post.images);
    let primaryImg = typeof post.image === 'string' ? post.image : "";
    let featuredImg = typeof post.featuredImage === 'string' ? post.featuredImage : primaryImg;

    // Prioritize custom uploaded image (data URL or local) over placeholder Unsplash
    if (gallery.length > 0 && gallery[0] && (gallery[0].startsWith("data:") || gallery[0].startsWith("/"))) {
      if (!primaryImg || primaryImg.includes("unsplash.com")) {
        primaryImg = gallery[0];
      }
      if (!featuredImg || featuredImg.includes("unsplash.com")) {
        featuredImg = gallery[0];
      }
    }

    if (primaryImg && gallery.length === 0) {
      gallery = [primaryImg];
    }

    await pool.query(
      `INSERT INTO blog_posts (id, title, slug, date, excerpt, content, image, featured_image, images, published, author, meta_description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       ON CONFLICT (id) DO UPDATE SET 
         title = $2, 
         slug = $3, 
         date = $4, 
         excerpt = $5, 
         content = $6, 
         image = $7, 
         featured_image = $8, 
         images = $9, 
         published = $10, 
         author = $11, 
         meta_description = $12`,
      [
        id,
        rawTitle || "Untitled",
        slug,
        String(post.date || new Date().toLocaleDateString('en-GB')),
        String(post.excerpt || ""),
        String(post.content || ""),
        primaryImg,
        featuredImg || primaryImg,
        JSON.stringify(gallery),
        post.published !== false,
        String(post.author || "Shekar Menon"),
        String(post.metaDescription || "")
      ]
    );
    return { success: true, id };
  });
}

export async function saveCollectionToSql(name: string, items: any[]): Promise<{ success: boolean }> {
  return executeSql(async (pool) => {
    const cleanName = name.replace(/^site_content_/, '');

    if (cleanName === 'blogPosts') {
      const validItems = Array.isArray(items) ? items : [];
      const ids: string[] = [];
      for (const p of validItems) {
        if (p && typeof p === 'object') {
          const res = await saveBlogPostToSql(p);
          if (res && res.id) ids.push(res.id);
        }
      }
      if (ids.length > 0) {
        await pool.query("DELETE FROM blog_posts WHERE NOT (id = ANY($1))", [ids]);
      }
      return { success: true };
    }

    if (cleanName === 'journalTrends') {
      const validItems = Array.isArray(items) ? items : [];
      const ids: string[] = [];
      for (let idx = 0; idx < validItems.length; idx++) {
        const t = validItems[idx];
        if (!t || typeof t !== 'object') continue;
        const id = String(t.id || `trend_${Date.now()}_${idx}`);
        ids.push(id);
        const gallery = safeParseArray(t.images);
        const primaryImg = typeof t.image === 'string' ? t.image : (gallery.length > 0 ? gallery[0] : "");
        const featuredImg = typeof t.featuredImage === 'string' ? t.featuredImage : primaryImg;
        await pool.query(
          `INSERT INTO journal_trends (id, title, date, excerpt, content, image, featured_image, images)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (id) DO UPDATE SET title = $2, date = $3, excerpt = $4, content = $5, image = $6, featured_image = $7, images = $8`,
          [
            id,
            String(t.title || "Trends"),
            String(t.date || ""),
            String(t.excerpt || ""),
            String(t.content || ""),
            primaryImg,
            featuredImg,
            JSON.stringify(gallery)
          ]
        );
      }
      if (ids.length > 0) {
        await pool.query("DELETE FROM journal_trends WHERE NOT (id = ANY($1))", [ids]);
      }
      return { success: true };
    }

    if (cleanName === 'shopProducts') {
      const validItems = Array.isArray(items) ? items : [];
      const ids = validItems.map(it => it.id).filter(Boolean);
      for (const pr of validItems) {
        const id = String(pr.id || `product_${Date.now()}`);
        const parsedPrice = parseInt(String(pr.price).replace(/[^0-9]/g, ''), 10) || 0;
        await pool.query(
          `INSERT INTO products (id, name, price, category, description, long_description, image, angles, metal_weight, diamond_weight, polki_weight, metal_quality, diamond_quality, colour_stone_weight, available_metals, available_sizes, details)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
           ON CONFLICT (id) DO UPDATE SET 
             name = $2, 
             price = $3, 
             category = $4, 
             description = $5, 
             long_description = $6, 
             image = $7, 
             angles = $8,
             metal_weight = $9,
             diamond_weight = $10,
             polki_weight = $11,
             metal_quality = $12,
             diamond_quality = $13,
             colour_stone_weight = $14,
             available_metals = $15,
             available_sizes = $16,
             details = $17`,
          [
            id,
            String(pr.name || pr.title || "Product"),
            parsedPrice,
            String(pr.category || ""),
            String(pr.description || ""),
            String(pr.longDescription || ""),
            String(pr.image || ""),
            JSON.stringify(safeParseArray(pr.angles)),
            String(pr.metalWeight || ""),
            String(pr.diamondWeight || ""),
            String(pr.polkiWeight || ""),
            String(pr.metalQuality || ""),
            String(pr.diamondQuality || ""),
            String(pr.colourStoneWeight || ""),
            JSON.stringify(safeParseArray(pr.availableMetals)),
            JSON.stringify(safeParseArray(pr.availableSizes)),
            JSON.stringify(safeParseArray(pr.details))
          ]
        );
      }
      if (ids.length > 0) {
        await pool.query("DELETE FROM products WHERE NOT (id = ANY($1))", [ids]);
      }
      return { success: true };
    }

    if (cleanName === 'heritageItems') {
      const validItems = Array.isArray(items) ? items : [];
      const ids = validItems.map(it => it.id).filter(Boolean);
      for (const h of validItems) {
        const id = String(h.id || `heritage_${Date.now()}`);
        await pool.query(
          `INSERT INTO heritage_items (id, title, era, year, description, materials, image)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (id) DO UPDATE SET title = $2, era = $3, year = $4, description = $5, materials = $6, image = $7`,
          [id, String(h.title || ""), String(h.era || ""), String(h.year || ""), String(h.description || ""), String(h.materials || ""), String(h.image || "")]
        );
      }
      if (ids.length > 0) {
        await pool.query("DELETE FROM heritage_items WHERE NOT (id = ANY($1))", [ids]);
      }
      return { success: true };
    }

    if (cleanName === 'methodologySteps') {
      const validItems = Array.isArray(items) ? items : [];
      const ids = validItems.map(it => it.id).filter(Boolean);
      for (let idx = 0; idx < validItems.length; idx++) {
        const m = validItems[idx];
        const id = String(m.id || `step_${Date.now()}_${idx}`);
        const stepOrder = typeof m.stepOrder === 'number' && m.stepOrder > 0 ? m.stepOrder : (idx + 1);
        await pool.query(
          `INSERT INTO methodology_steps (id, title, subtitle, text, detail, image, step_order)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (id) DO UPDATE SET title = $2, subtitle = $3, text = $4, detail = $5, image = $6, step_order = $7`,
          [id, String(m.title || ""), String(m.subtitle || ""), String(m.text || ""), String(m.detail || ""), String(m.image || ""), stepOrder]
        );
      }
      if (ids.length > 0) {
        await pool.query("DELETE FROM methodology_steps WHERE NOT (id = ANY($1))", [ids]);
      }
      return { success: true };
    }

    if (cleanName === 'brideGallery') {
      const validItems = Array.isArray(items) ? items : [];
      const ids = validItems.map(it => it.id).filter(Boolean);
      for (const b of validItems) {
        const id = String(b.id || `bride_${Date.now()}`);
        await pool.query(
          `INSERT INTO bride_gallery (id, name, story, description, image, images)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (id) DO UPDATE SET name = $2, story = $3, description = $4, image = $5, images = $6`,
          [id, String(b.name || ""), String(b.story || ""), String(b.description || ""), String(b.image || ""), JSON.stringify(safeParseArray(b.images))]
        );
      }
      if (ids.length > 0) {
        await pool.query("DELETE FROM bride_gallery WHERE NOT (id = ANY($1))", [ids]);
      }
      return { success: true };
    }

    return { success: true };
  });
}

export async function saveGlobalContentToSql(newContent: any) {
  return executeSql(async (pool) => {
    const {
      shopProducts,
      blogPosts,
      journalTrends,
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
  });
}