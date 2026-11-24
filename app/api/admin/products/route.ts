import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function GET() {
  const products = await db.product.findMany({
    include: {
      category: true,
      images: { orderBy: { position: "asc" } },
      variants: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ products });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      nameEn,
      nameFr,
      slug,
      descriptionEn,
      descriptionFr,
      basePriceMillimes,
      compareAtMillimes,
      categoryId,
      isPublished = true,
      isFeatured = false,
      isNew = false,
      color = "Black",
      colorHex = "#151515",
      imageUrl,
      initialStock = 15,
    } = body;

    if (!nameEn || !slug || !basePriceMillimes) {
      return NextResponse.json({ error: "Missing required fields (name, slug, price)" }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-");

    const existing = await db.product.findUnique({ where: { slug: cleanSlug } });
    if (existing) {
      return NextResponse.json({ error: "Product slug already exists" }, { status: 400 });
    }

    // Default category fallback
    let catId = categoryId;
    if (!catId) {
      const firstCat = await db.category.findFirst();
      catId = firstCat?.id;
    }

    const product = await db.product.create({
      data: {
        slug: cleanSlug,
        nameEn,
        nameFr: nameFr || nameEn,
        descriptionEn: descriptionEn || nameEn,
        descriptionFr: descriptionFr || nameFr || nameEn,
        basePriceMillimes: Number(basePriceMillimes),
        compareAtMillimes: compareAtMillimes ? Number(compareAtMillimes) : null,
        categoryId: catId,
        isPublished: !!isPublished,
        isFeatured: !!isFeatured,
        isNew: !!isNew,
        images: {
          create: [
            {
              url: imageUrl || "/brand/products/black-signature-hoodie/front.jpg",
              position: 0,
              altEn: nameEn,
              altFr: nameFr || nameEn,
            },
          ],
        },
        variants: {
          create: ["XS", "S", "M", "L", "XL", "XXL"].map((sz) => ({
            size: sz,
            color,
            colorHex,
            sku: `${cleanSlug.toUpperCase().slice(0, 4)}-${sz}-${Math.floor(100 + Math.random() * 900)}`,
            stock: Number(initialStock),
          })),
        },
      },
      include: {
        images: true,
        variants: true,
      },
    });

    try {
      revalidatePath("/");
      revalidatePath("/shop");
      revalidatePath("/collections");
      revalidatePath("/collections/[slug]", "page");
      revalidatePath(`/product/${product.slug}`);
      revalidatePath("/admin/products");
    } catch (e) {
      // Ignore
    }

    return NextResponse.json({ success: true, product });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create product" }, { status: 500 });
  }
}
