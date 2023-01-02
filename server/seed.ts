import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({ data: { id: 1, name: "ダミーユーザ" } });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("完了");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
