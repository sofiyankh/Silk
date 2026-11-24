const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Silk E-Commerce Database...');

  // 1. Single Admin User (Store products only in DB, only 1 user is Admin)
  const adminPassword = await bcrypt.hash('AdminPassword123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@silk.com' },
    update: {
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
    create: {
      email: 'admin@silk.com',
      passwordHash: adminPassword,
      name: 'Silk Admin',
      role: 'ADMIN',
      locale: 'fr',
    },
  });

  // 2. Categories
  const categoriesData = [
    {
      slug: 'hoodies',
      nameEn: 'Hoodies',
      nameFr: 'Sweats à Capuche',
      descriptionEn: 'Premium heavyweight cotton hoodies with signature botanical & butterfly artwork.',
      descriptionFr: 'Sweats à capuche en coton lourd haut de gamme avec broderies et illustrations signatures.',
    },
    {
      slug: 't-shirts',
      nameEn: 'T-Shirts',
      nameFr: 'T-Shirts',
      descriptionEn: 'Relaxed fit tees featuring detailed silk-screened illustrations.',
      descriptionFr: 'T-shirts coupe décontractée avec sérigraphies artistiques détaillées.',
    },
    {
      slug: 'pants',
      nameEn: 'Pants',
      nameFr: 'Pantalons',
      descriptionEn: 'Contemporary cargo and pleated streetwear silhouettes.',
      descriptionFr: 'Pantalons cargo contemporains et silhouettes plissées streetwear.',
    },
    {
      slug: 'accessories',
      nameEn: 'Accessories',
      nameFr: 'Accessoires',
      descriptionEn: 'Signature beanies, socks, and silk-embroidered caps.',
      descriptionFr: 'Bonnets signature, chaussettes et casquettes brodées.',
    },
  ];

  const categories = {};
  for (const cat of categoriesData) {
    categories[cat.slug] = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }

  // 3. Products matching the exact models structure
  const productsData = [
    {
      slug: 'butterfly-hoodie',
      nameEn: 'Butterfly Cream 450GSM Hoodie',
      nameFr: 'Sweat à Capuche Papillon Crème',
      descriptionEn: 'Premium oversized hoodie with exclusive botanical butterfly needlework across chest and sleeves. Crafted from heavyweight 450GSM organic brushed cotton with refined ribbed trims.',
      descriptionFr: 'Sweat à capuche oversize haut de gamme avec illustrations exclusives de papillons sur les manches, le dos et la poitrine. Confectionné en coton brossé biologique lourd 450GSM.',
      basePriceMillimes: 89000,
      compareAtMillimes: 110000,
      categoryId: categories.hoodies.id,
      isFeatured: true,
      isNew: true,
      color: 'Cream',
      colorHex: '#F0EBE2',
      images: [
        '/hoodies/models/women/butterfly/cream/butterfly-print-hoodie-front.png',
        '/hoodies/models/women/butterfly/cream/butterfly-hoodie-back-view.png',
        '/hoodies/models/women/butterfly/cream/Ivory Floral Butterfly Garland.png'
      ],
    },
    {
      slug: 'birds-sakura-hoodie',
      nameEn: 'Birds & Blossom White 450GSM Hoodie',
      nameFr: 'Sweat Oiseaux & Sakura Blanc',
      descriptionEn: 'Serene songbirds on blossoming branches set against pure unbleached white fleece. Heavyweight French terry tailored with an oversized silhouette.',
      descriptionFr: 'Oiseaux chanteurs sereins sur branches fleuries sur molleton blanc naturel. Silhouette oversize conçue pour le confort et la durabilité.',
      basePriceMillimes: 89000,
      compareAtMillimes: 110000,
      categoryId: categories.hoodies.id,
      isFeatured: true,
      isNew: true,
      color: 'White',
      colorHex: '#F7F7F7',
      images: [
        '/hoodies/models/men/birds-sakura/white/cherry-blossom-bird-hoodie-portrait.png',
        '/hoodies/models/men/birds-sakura/white/bird-blossom-hoodie-catalog-collage.png',
        '/hoodies/models/men/birds-sakura/white/cherry-blossom-hoodie-back-design.png'
      ],
    },
    {
      slug: 'sakura-hoodie',
      nameEn: 'Sakura Blossom White 450GSM Hoodie',
      nameFr: 'Sweat Fleur de Cerisier Sakura Blanc',
      descriptionEn: 'Delicate pink sakura cherry blossom branches trailing over the shoulder, back and hood. 450GSM luxury terry cotton with metallic aglets on tonal drawstrings.',
      descriptionFr: 'Délicates branches de fleurs de cerisier sakura rose traversant l’épaule, le dos et la capuche. Coton éponge de luxe 450GSM avec embouts métalliques.',
      basePriceMillimes: 89000,
      compareAtMillimes: 110000,
      categoryId: categories.hoodies.id,
      isFeatured: true,
      isNew: true,
      color: 'Heather White',
      colorHex: '#EAE6E1',
      images: [
        '/hoodies/models/men/cherry-blossom/white/cherry-blossom-hoodie-front.png',
        '/hoodies/models/men/cherry-blossom/white/cherry-blossom-hoodie-back.png',
        '/hoodies/models/men/cherry-blossom/white/cherry-blossom-hoodie-lookbook-details.png'
      ],
    },
    {
      slug: 'sakura-women-hoodie',
      nameEn: 'Sakura Blossom Women Edition',
      nameFr: 'Sweat Fleur de Cerisier Sakura Femme',
      descriptionEn: 'The signature Sakura cherry blossom hoodie styled in relaxed feminine tailoring, featuring floral accents and brushed interior.',
      descriptionFr: 'Le sweat emblématique sakura fleurs de cerisier dans une coupe féminine décontractée avec intérieur brossé.',
      basePriceMillimes: 89000,
      compareAtMillimes: 110000,
      categoryId: categories.hoodies.id,
      isFeatured: false,
      isNew: true,
      color: 'Heather White',
      colorHex: '#EAE6E1',
      images: [
        '/hoodies/models/women/cherry-blossom/white/young-woman-in-cherry-blossom-hoodie.png'
      ],
    },
    {
      slug: 'black-signature-hoodie',
      nameEn: 'Cherry Blossom Bird Black Hoodie',
      nameFr: 'Sweat Noir Cherry Blossom Bird',
      descriptionEn: 'Signature Silk needle & thread embroidery paired with two delicate songbirds perched on blossom branches over deep obsidian fleece.',
      descriptionFr: 'Broderie signature Silk à l’aiguille et fil accompagnée de deux oiseaux perchés sur branches fleuries sur molleton noir profond.',
      basePriceMillimes: 89000,
      compareAtMillimes: 110000,
      categoryId: categories.hoodies.id,
      isFeatured: true,
      isNew: false,
      color: 'Deep Black',
      colorHex: '#181818',
      images: [
        '/hoodies/models/women/cherry-blossom-bird/black/cherry-blossom-hoodieblack.png',
        '/hoodies/models/women/cherry-blossom-bird/black/cherry-blossom-hoodie-black-back.png',
        '/hoodies/models/women/cherry-blossom-bird/black/cherry-blossom-hoodie-split-panel-showcase-black.png'
      ],
    },
    {
      slug: 'blue-floral-hoodie',
      nameEn: 'Midnight Blue Floral 450GSM Hoodie',
      nameFr: 'Sweat Floral Bleu Nuit',
      descriptionEn: 'Vibrant azure botanical florals winding along deep black cotton. Features detailed petal stitching, drop shoulder tailoring and double-layered hood.',
      descriptionFr: 'Motifs floraux bleu azur éclatants sur coton noir profond. Coutures de pétales détaillées, coupe épaules tombantes et capuche doublée.',
      basePriceMillimes: 89000,
      compareAtMillimes: 110000,
      categoryId: categories.hoodies.id,
      isFeatured: true,
      isNew: false,
      color: 'Deep Black',
      colorHex: '#151515',
      images: [
        '/hoodies/models/men/floral-branch/black/back-view-floral-branch-back-hoodiefront.png',
        '/hoodies/models/men/floral-branch/black/back-view-floral-branch-back-hoodie.png',
        '/hoodies/models/men/floral-branch/black/back-view-floral-branch-back-hoodie2.png'
      ],
    },
    {
      slug: 'monochrome-blossom-hoodie',
      nameEn: 'Monochrome Blossom 450GSM Hoodie',
      nameFr: 'Sweat Monochrome Sakura Noir & Blanc',
      descriptionEn: 'Monochromatic ink-wash botanical branches rendered in rich charcoal and black inks over an off-white cotton base. An understated streetwear staple.',
      descriptionFr: 'Branches botaniques monochromes façon lavis d’encre en nuances de fusain et noir sur base coton blanc cassé. Une pièce maîtresse intemporelle.',
      basePriceMillimes: 89000,
      compareAtMillimes: 110000,
      categoryId: categories.hoodies.id,
      isFeatured: false,
      isNew: false,
      color: 'Light Melange',
      colorHex: '#E5E2DC',
      images: [
        '/hoodies/models/men/monochrome-cherry-blossom/white/monochrome-cherry-blossom-hoodie-front.png',
        '/hoodies/models/men/monochrome-cherry-blossom/white/monochrome-cherry-blossom-hoodie-back.png',
        '/hoodies/models/men/monochrome-cherry-blossom/white/monochrome-cherry-blossom-hoodie-showcase.png'
      ],
    },
    {
      slug: 'essential-blank-hoodie',
      nameEn: 'Essential Blank White 450GSM Hoodie',
      nameFr: 'Sweat Basique Vierge 450GSM Blanc',
      descriptionEn: 'The pure architecture of Silk streetwear. Heavyweight 450GSM organic French terry blank hoodie with zero graphics, oversized drop shoulders, double-lined hood and raw tactile minimalism.',
      descriptionFr: 'L’architecture pure du streetwear Silk. Sweat vierge en molleton 450GSM sans motifs, coupe oversize et finitions épurées.',
      basePriceMillimes: 79000,
      compareAtMillimes: 95000,
      categoryId: categories.hoodies.id,
      isFeatured: false,
      isNew: true,
      color: 'Optic White',
      colorHex: '#FFFFFF',
      images: [
        '/hoodies/models/blank-model/men/white/whitehoodiefront.png',
        '/hoodies/models/blank-model/men/white/whitehoodieback.png',
        '/hoodies/models/blank-model/men/white/whiehoodiesleeves.png'
      ],
    },
  ];

  const createdVariants = [];

  for (const p of productsData) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        nameEn: p.nameEn,
        nameFr: p.nameFr,
        descriptionEn: p.descriptionEn,
        descriptionFr: p.descriptionFr,
        basePriceMillimes: p.basePriceMillimes,
        compareAtMillimes: p.compareAtMillimes,
        categoryId: p.categoryId,
        isFeatured: p.isFeatured,
        isNew: p.isNew,
      },
      create: {
        slug: p.slug,
        nameEn: p.nameEn,
        nameFr: p.nameFr,
        descriptionEn: p.descriptionEn,
        descriptionFr: p.descriptionFr,
        basePriceMillimes: p.basePriceMillimes,
        compareAtMillimes: p.compareAtMillimes,
        categoryId: p.categoryId,
        isFeatured: p.isFeatured,
        isNew: p.isNew,
      },
    });

    // Delete existing images to avoid duplicates on re-seed
    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    for (let i = 0; i < p.images.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: p.images[i],
          position: i,
          altEn: `${p.nameEn} view ${i + 1}`,
          altFr: `${p.nameFr} vue ${i + 1}`,
        },
      });
    }

    // Variants for sizes: XS, S, M, L, XL, XXL
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    for (const size of sizes) {
      const sku = `${p.slug.toUpperCase().slice(0, 4)}-${p.color.toUpperCase().slice(0, 3)}-${size}`;
      const variant = await prisma.variant.upsert({
        where: { sku },
        update: {
          stock: size === 'M' || size === 'L' ? 18 : 8,
        },
        create: {
          productId: product.id,
          size,
          color: p.color,
          colorHex: p.colorHex,
          sku,
          stock: size === 'M' || size === 'L' ? 18 : 8,
        },
      });
      createdVariants.push({ ...variant, productName: p.nameEn });
    }
  }

  // 4. Discounts
  await prisma.discount.upsert({
    where: { code: 'SILK10' },
    update: {},
    create: {
      name: '10% Launch Promotion',
      code: 'SILK10',
      type: 'PERCENT',
      value: 10,
      startsAt: new Date(),
      isActive: true,
    },
  });

  await prisma.discount.upsert({
    where: { code: 'WELCOME' },
    update: {},
    create: {
      name: 'Welcome Gift 15%',
      code: 'WELCOME',
      type: 'PERCENT',
      value: 15,
      startsAt: new Date(),
      isActive: true,
    },
  });

  // 5. Settings
  const settings = [
    { key: 'shipping.flatFeeMillimes', value: '7000' },
    { key: 'shipping.freeThresholdMillimes', value: '100000' },
    { key: 'announcement.text', value: 'CASH ON DELIVERY AVAILABLE • NOUVELLE COLLECTION DISPONIBLE' },
    { key: 'store.name', value: 'SILK' },
    { key: 'store.contactPhone', value: '+216 71 000 000' },
    { key: 'store.contactEmail', value: 'contact@silk-streetwear.com' },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }

  // 6. Orders matching UI moodboard (#000123, #000122, #000121, #000120)
  const butterflyVar = createdVariants.find(v => v.productName === 'Butterfly Hoodie' && v.size === 'M') || createdVariants[0];
  const sakuraVar = createdVariants.find(v => v.productName === 'Sakura Blossom Hoodie' && v.size === 'L') || createdVariants[1];
  const floralVar = createdVariants.find(v => v.productName === 'Blue Floral Hoodie' && v.size === 'XL') || createdVariants[2];

  const demoOrders = [
    {
      number: 'ORD-000123',
      status: 'DELIVERED',
      createdAt: new Date('2025-04-12T14:30:00Z'),
      deliveredAt: new Date('2025-04-15T10:00:00Z'),
      cashCollectedAt: new Date('2025-04-15T10:00:00Z'),
      subtotalMillimes: 178000,
      discountMillimes: 1000,
      shippingMillimes: 0,
      totalMillimes: 177000,
      items: [
        { variantId: butterflyVar.id, productName: 'Butterfly Hoodie', size: 'M', color: 'Cream', quantity: 2, unitMillimes: 89000 },
      ],
    },
    {
      number: 'ORD-000122',
      status: 'SHIPPED',
      createdAt: new Date('2025-04-05T09:15:00Z'),
      shippedAt: new Date('2025-04-06T11:00:00Z'),
      subtotalMillimes: 89000,
      discountMillimes: 0,
      shippingMillimes: 0,
      totalMillimes: 89000,
      items: [
        { variantId: sakuraVar.id, productName: 'Sakura Blossom Hoodie', size: 'L', color: 'Grey', quantity: 1, unitMillimes: 89000 },
      ],
    },
    {
      number: 'ORD-000121',
      status: 'PROCESSING',
      createdAt: new Date('2025-03-28T16:45:00Z'),
      subtotalMillimes: 178000,
      discountMillimes: 0,
      shippingMillimes: 0,
      totalMillimes: 178000,
      items: [
        { variantId: floralVar.id, productName: 'Blue Floral Hoodie', size: 'XL', color: 'Black', quantity: 2, unitMillimes: 89000 },
      ],
    },
    {
      number: 'ORD-000120',
      status: 'DELIVERED',
      createdAt: new Date('2025-03-20T12:00:00Z'),
      deliveredAt: new Date('2025-03-23T15:20:00Z'),
      cashCollectedAt: new Date('2025-03-23T15:20:00Z'),
      subtotalMillimes: 210000,
      discountMillimes: 0,
      shippingMillimes: 0,
      totalMillimes: 210000,
      items: [
        { variantId: butterflyVar.id, productName: 'Butterfly Hoodie', size: 'M', color: 'Cream', quantity: 1, unitMillimes: 89000 },
        { variantId: sakuraVar.id, productName: 'Sakura Blossom Hoodie', size: 'L', color: 'Grey', quantity: 1, unitMillimes: 89000 },
      ],
    },
  ];

  for (const o of demoOrders) {
    const existing = await prisma.order.findUnique({ where: { number: o.number } });
    if (!existing) {
      const order = await prisma.order.create({
        data: {
          number: o.number,
          userId: null,
          addressId: null,
          status: o.status,
          createdAt: o.createdAt,
          shippedAt: o.shippedAt,
          deliveredAt: o.deliveredAt,
          cashCollectedAt: o.cashCollectedAt,
          subtotalMillimes: o.subtotalMillimes,
          discountMillimes: o.discountMillimes,
          shippingMillimes: o.shippingMillimes,
          totalMillimes: o.totalMillimes,
          contactName: 'Sofiene Kh',
          contactPhone: '+216 98 123 456',
          contactEmail: 'sofiene@example.com',
          shippingAddress: '123 Avenue Habib Bourguiba, Tunis',
          city: 'Tunis',
          postalCode: '1000',
          paymentMethod: 'COD',
        },
      });

      for (const it of o.items) {
        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            variantId: it.variantId,
            productName: it.productName,
            size: it.size,
            color: it.color,
            quantity: it.quantity,
            unitMillimes: it.unitMillimes,
          },
        });
      }

      await prisma.orderStatusEvent.create({
        data: {
          orderId: order.id,
          status: o.status,
          changedBy: 'system',
          note: `Order ${o.status.toLowerCase()} initially seeded`,
          createdAt: o.createdAt,
        },
      });
    }
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
