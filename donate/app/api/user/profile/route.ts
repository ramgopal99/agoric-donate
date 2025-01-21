import { auth } from "@/app/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import * as z from "zod"

const profileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
})

export async function PATCH(req: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { name, email } = profileSchema.parse(body)

    // Check if email is already taken by another user
    if (email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (existingUser) {
        return new NextResponse("Email already taken", { status: 400 })
      }
    }

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name,
        email,
      },
    })

    return new NextResponse("Profile updated", { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 })
    }

    return new NextResponse(null, { status: 500 })
  }
}
