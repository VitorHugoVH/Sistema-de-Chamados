import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Categorias iniciais para facilitar a demonstração.
// O seed não cria usuários: eles são cadastrados via POST /auth/register.
const categories = [
  { name: "Hardware", description: "Problemas com computadores, impressoras e periféricos" },
  { name: "Software", description: "Instalação, erros e atualização de programas" },
  { name: "Rede", description: "Internet, Wi-Fi e acesso à rede interna" },
  { name: "Acesso", description: "Criação de contas, senhas e permissões" },
];

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }
  console.log(`Seed concluído: ${categories.length} categorias.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
