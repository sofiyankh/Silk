import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const addresses = await db.address.findMany({
    where: { userId: user.id },
    orderBy: { isDefault: "desc" },
  });

  return NextResponse.json({ addresses });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { fullName, phone, line1, line2, city, governorate, postalCode, isDefault } = body;

  if (!fullName || !phone || !line1 || !city) {
    return NextResponse.json({ error: "Missing required address fields" }, { status: 400 });
  }

  if (isDefault) {
    await db.address.updateMany({
      where: { userId: user.id },
      data: { isDefault: false },
    });
  }

  const address = await db.address.create({
    data: {
      userId: user.id,
      fullName,
      phone,
      line1,
      line2: line2 || null,
      city,
      governorate: governorate || "Tunis",
      postalCode: postalCode || null,
      isDefault: !!isDefault,
    },
  });

  return NextResponse.json({ success: true, address });
}

export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Address ID required" }, { status: 400 });
  }

  await db.address.deleteMany({
    where: { id, userId: user.id },
  });

  return NextResponse.json({ success: true });
}
