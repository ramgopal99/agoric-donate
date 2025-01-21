import { prisma } from "@/lib/prisma";
import { getSession } from "next-auth/react";

// Utility function to get the authenticated user's ID
async function getUserId(req: Request) {
  const session = await getSession({ req: { headers: Object.fromEntries(req.headers) } });

  if (!session?.user?.id) {
    throw new Error("User is not authenticated.");
  }

  return session.user.id;
}

// Fetch all templates for the authenticated user
export async function GET(req: Request) {
  try {
    const userId = await getUserId(req);

    const templates = await prisma.template.findMany({
      where: { userId },
    });

    return new Response(JSON.stringify(templates), { status: 200 });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred while fetching templates." }),
      { status: 500 }
    );
  }
}

// Add a new template for the authenticated user
export async function POST(req: Request) {
  try {
    const userId = await getUserId(req);
    const { name, subject, content } = await req.json();

    const newTemplate = await prisma.template.create({
      data: {
        name,
        subject,
        content,
        userId,
      },
    });

    return new Response(JSON.stringify(newTemplate), { status: 201 });
  } catch (error) {
    console.error("Error adding template:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred while adding the template." }),
      { status: 500 }
    );
  }
}

// Update a template for the authenticated user
export async function PATCH(req: Request) {
  try {
    const userId = await getUserId(req);
    const { id, name, subject, content } = await req.json();

    // Ensure the template belongs to the user
    const template = await prisma.template.findUnique({
      where: { id },
    });

    if (!template || template.userId !== userId) {
      return new Response(
        JSON.stringify({ error: "Template not found or unauthorized." }),
        { status: 404 }
      );
    }

    const updatedTemplate = await prisma.template.update({
      where: { id },
      data: { name, subject, content },
    });

    return new Response(JSON.stringify(updatedTemplate), { status: 200 });
  } catch (error) {
    console.error("Error updating template:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred while updating the template." }),
      { status: 500 }
    );
  }
}

// Delete a template for the authenticated user
export async function DELETE(req: Request) {
  try {
    const userId = await getUserId(req);
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    // Ensure the template belongs to the user
    const template = await prisma.template.findUnique({
      where: { id },
    });

    if (!template || template.userId !== userId) {
      return new Response(
        JSON.stringify({ error: "Template not found or unauthorized." }),
        { status: 404 }
      );
    }

    await prisma.template.delete({
      where: { id },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting template:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred while deleting the template." }),
      { status: 500 }
    );
  }
}
