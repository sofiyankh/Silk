/**
 * scripts/fix-image-urls.js
 * Scans ProductImage.url, SpinFrame.url, and Category.image for absolute paths
 * and maps them to clean relative web paths served from /public.
 *
 * Usage:
 *   node scripts/fix-image-urls.js          # Defaults to DRY-RUN mode
 *   node scripts/fix-image-urls.js --dry-run # Explicit DRY-RUN
 *   node scripts/fix-image-urls.js --execute # Real database writes (requires confirmation)
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const isDryRun = !process.argv.includes('--execute');

function toWebPath(oldPath) {
  if (!oldPath) return oldPath;
  let clean = oldPath.trim();

  // Strip file:// protocol
  if (clean.startsWith('file://')) {
    clean = clean.replace('file://', '');
  }

  // If path contains /public/, extract the portion from /public/ onward
  const publicIdx = clean.indexOf('/public/');
  if (publicIdx !== -1) {
    clean = clean.substring(publicIdx + '/public'.length);
  } else if (clean.includes('/home/') || clean.includes('/Users/') || /^[a-zA-Z]:\\/.test(clean)) {
    // If it is absolute inside project root, normalize
    const brandIdx = clean.indexOf('/brand/');
    if (brandIdx !== -1) {
      clean = clean.substring(brandIdx + '/brand'.length);
    }
  }

  // Ensure leading slash
  if (!clean.startsWith('/') && !clean.startsWith('http')) {
    clean = '/' + clean;
  }

  return clean;
}

async function main() {
  console.log(`\n======================================================`);
  console.log(`FIX IMAGE URLS MIGRATION SCRIPT (${isDryRun ? 'DRY-RUN MODE' : 'LIVE WRITE MODE'})`);
  console.log(`======================================================\n`);

  let totalScanned = 0;
  let totalCandidates = 0;

  // 1. Product Images
  const productImages = await prisma.productImage.findMany();
  totalScanned += productImages.length;
  const piUpdates = [];

  for (const img of productImages) {
    const target = toWebPath(img.url);
    if (target !== img.url) {
      piUpdates.push({ id: img.id, oldUrl: img.url, newUrl: target });
    }
  }

  console.log(`[ProductImage] Scanned: ${productImages.length}, Needing Fix: ${piUpdates.length}`);
  for (const item of piUpdates) {
    console.log(`  - [ID: ${item.id}] ${item.oldUrl} -> ${item.newUrl}`);
    if (!isDryRun) {
      await prisma.productImage.update({
        where: { id: item.id },
        data: { url: item.newUrl }
      });
    }
  }
  totalCandidates += piUpdates.length;

  // 2. Spin Frames
  const spinFrames = await prisma.spinFrame.findMany();
  totalScanned += spinFrames.length;
  const sfUpdates = [];

  for (const sf of spinFrames) {
    const target = toWebPath(sf.url);
    if (target !== sf.url) {
      sfUpdates.push({ id: sf.id, oldUrl: sf.url, newUrl: target });
    }
  }

  console.log(`\n[SpinFrame] Scanned: ${spinFrames.length}, Needing Fix: ${sfUpdates.length}`);
  for (const item of sfUpdates) {
    console.log(`  - [ID: ${item.id}] ${item.oldUrl} -> ${item.newUrl}`);
    if (!isDryRun) {
      await prisma.spinFrame.update({
        where: { id: item.id },
        data: { url: item.newUrl }
      });
    }
  }
  totalCandidates += sfUpdates.length;

  // 3. Category Images
  const categories = await prisma.category.findMany();
  totalScanned += categories.length;
  const catUpdates = [];

  for (const cat of categories) {
    if (cat.image) {
      const target = toWebPath(cat.image);
      if (target !== cat.image) {
        catUpdates.push({ id: cat.id, slug: cat.slug, oldImage: cat.image, newImage: target });
      }
    }
  }

  console.log(`\n[Category] Scanned: ${categories.length}, Needing Fix: ${catUpdates.length}`);
  for (const item of catUpdates) {
    console.log(`  - [Category: ${item.slug}] ${item.oldImage} -> ${item.newImage}`);
    if (!isDryRun) {
      await prisma.category.update({
        where: { id: item.id },
        data: { image: item.newImage }
      });
    }
  }
  totalCandidates += catUpdates.length;

  console.log(`\n------------------------------------------------------`);
  console.log(`Total scanned rows: ${totalScanned}`);
  console.log(`Total rows requiring updates: ${totalCandidates}`);
  if (isDryRun) {
    console.log(`Status: DRY-RUN complete. Zero database writes performed.`);
  } else {
    console.log(`Status: LIVE WRITES complete. Updated ${totalCandidates} rows.`);
  }
  console.log(`------------------------------------------------------\n`);
}

main()
  .catch((e) => {
    console.error('Migration error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
