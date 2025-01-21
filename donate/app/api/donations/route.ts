import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, category, goal, description, image } = body;

    // Create a new donation record
    const newDonation = await prisma.donation.create({
      data: {
        title,
        category,
        goal: parseFloat(goal),
        description,
        image,
        amountRaised: 0, // Start with 0 amount raised
        walletId: "some-wallet-id", // Add walletId property
      },
    });
    
    return NextResponse.json(newDonation);
  } catch (error) {
    console.error("Error creating donation:", error);
    return NextResponse.json(
      { error: "Error creating donation" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const donations = await prisma.donation.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(donations);
  } catch (error) {
    console.error("Error fetching donations:", error);
    return NextResponse.json(
      { error: "Error fetching donations" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, title, category, goal, description, image, userId } = body;

    // First, check if the donation exists and belongs to the user
    const existingDonation = await prisma.donation.findUnique({
      where: { id }
    });

    if (!existingDonation) {
      return NextResponse.json(
        { error: "Donation not found" },
        { status: 404 }
      );
    }

    if (existingDonation.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized to edit this donation" },
        { status: 403 }
      );
    }

    // Update the donation
    const updatedDonation = await prisma.donation.update({
      where: { id },
      data: {
        title,
        category,
        goal: parseFloat(goal),
        description,
        image,
      },
    });

    return NextResponse.json(updatedDonation);
  } catch (error) {
    console.error("Error updating donation:", error);
    return NextResponse.json(
      { error: "Error updating donation" },
      { status: 500 }
    );
  }
}
