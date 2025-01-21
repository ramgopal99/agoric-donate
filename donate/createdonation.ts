import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createRandomDonations() {
  const donations = [
    {
      title: "Save the Rainforest",
      category: "Environment",
      goal: 5000,
      description: "Help us protect the rainforest and its wildlife.",
      image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
      amountRaised: 2500, // Half of the goal
    },
    {
      title: "Educate a Child",
      category: "Education",
      goal: 3000,
      description: "Provide education to underprivileged children.",
      image: "https://images.unsplash.com/photo-1554774853-bc6c4fcf8e8c",
      amountRaised: 1500, // Half of the goal
    },
    {
      title: "Animal Shelter Support",
      category: "Animals",
      goal: 2000,
      description: "Support local animal shelters in need of resources.",
      image: "https://images.unsplash.com/photo-1560807707-8cc77767d783",
      amountRaised: 1000, // Half of the goal
    },
    {
      title: "Clean Water Initiative",
      category: "Humanitarian",
      goal: 4000,
      description: "Provide clean water to communities in need.",
      image: "https://images.unsplash.com/photo-1556740749-887f6717d7e4",
      amountRaised: 0,
    },
    {
      title: "Wildlife Conservation",
      category: "Environment",
      goal: 6000,
      description: "Help conserve wildlife habitats.",
      image: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13",
      amountRaised: 3000, // Half of the goal
    },
    {
      title: "Healthcare for All",
      category: "Health",
      goal: 7000,
      description: "Ensure healthcare access for everyone.",
      image: "https://images.unsplash.com/photo-1580281658628-0c8b9f1d3f91",
      amountRaised: 3500, // Half of the goal
    },
  ];

  for (const donation of donations) {
    await prisma.donation.create({
      data: donation,
    });
  }

  console.log("Random donations created successfully.");
}

createRandomDonations()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });