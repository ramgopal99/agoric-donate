import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const defaultTemplates = [
    {
      name: 'Default Template 1',
      subject: 'Welcome to Our Service!',
      content: 'This is the default content for template 1.',
      isDefault: true,
    },
    {
      name: 'Default Template 2',
      subject: 'Follow-up Email',
      content: 'This is the default content for template 2.',
      isDefault: true,
    },
  ];

  for (const template of defaultTemplates) {
    await prisma.template.upsert({
      where: { name: template.name },
      update: {},
      create: template,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
