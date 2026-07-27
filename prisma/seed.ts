import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error("DATABASE_URL is missing in environment variables.");
    process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("Seeding Database...");

    // Hapus data lama jika ada, agar bersih
    await prisma.user.deleteMany({
        where: { email: "admin@perusahaan.com" }
    });

    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Buat User
    const admin = await prisma.user.create({
        data: {
            name: "Administrator HR",
            email: "admin@perusahaan.com",
            emailVerified: true,
            role: "ADMIN",
            position: "HR Manager"
        }
    });

    // Buat Account untuk Better Auth (Karena Better Auth menyimpan password di tabel Account untuk kredensial)
    await prisma.account.create({
        data: {
            userId: admin.id,
            accountId: admin.email,
            providerId: "credential",
            password: hashedPassword,
        }
    });

    console.log(`Created admin account: ${admin.email} / admin123`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
