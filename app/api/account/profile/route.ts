import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, phone, currentPassword, newPassword } = body;

  const updateData: any = {};
  if (name) updateData.name = name;
  if (phone) updateData.phone = phone;

  if (newPassword) {
    if (!currentPassword) {
      return NextResponse.json({ error: "Current password is required to change password" }, { status: 400 });
    }
    const dbUser = await db.user.findUnique({ where: { id: user.id } });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const valid = await bcrypt.compare(currentPassword, dbUser.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }
    updateData.passwordHash = await bcrypt.hash(newPassword, 12);
  }

  const updated = await db.user.update({
    where: { id: user.id },
    data: updateData,
    select: { id: true, email: true, name: true, phone: true, role: true },
  });

  return NextResponse.json({ success: true, user: updated });
}
