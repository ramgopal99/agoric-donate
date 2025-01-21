import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { walletId, adminAmount, userDonation, donationId } = body;

    // First check if the user exists, if not create them
    let user = await prisma.user.findUnique({
      where: {
        id: walletId
      }
    });

    if (!user) {
      // Create a new user if they don't exist
      user = await prisma.user.create({
        data: {
          id: walletId,
          walletAmount: 0,
          name: `Admin ${walletId.slice(0, 6)}` // Create a default name
        }
      });
    }

    // Create a new record in the AdminIncome table
    const adminIncomeEntry = await prisma.adminIncome.create({
      data: {
        amount: parseFloat(adminAmount),
        userId: user.id,
      },
    });

    let updatedDonation = null;
    if (donationId) {
      // Update the donation amount in the Donation table only if donationId exists
      updatedDonation = await prisma.donation.update({
        where: {
          id: parseInt(donationId)
        },
        data: {
          amountRaised: {
            increment: parseFloat(userDonation)
          }
        }
      });
    }

    return NextResponse.json({ 
      success: true, 
      adminIncome: adminIncomeEntry,
      donation: updatedDonation,
      user: user
    });

  } catch (error) {
    console.error("Error processing donation:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to process donation",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}