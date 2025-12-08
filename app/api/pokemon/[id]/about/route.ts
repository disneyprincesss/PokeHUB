import { NextRequest, NextResponse } from "next/server";
import { getAboutInfo, setAboutInfo, deleteAboutInfo } from "@/app/lib/db";

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/pokemon/[id]/about
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const pokemonId = parseInt(id);

  if (isNaN(pokemonId)) {
    return NextResponse.json({ error: "Invalid Pokemon ID" }, { status: 400 });
  }

  const aboutInfo = getAboutInfo(pokemonId);

  return NextResponse.json({
    data: {
      pokemonId,
      aboutInfo: aboutInfo ?? {
        height: null,
        weight: null,
        description: null,
      },
    },
  });
}

// PUT /api/pokemon/[id]/about
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const pokemonId = parseInt(id);

  if (isNaN(pokemonId)) {
    return NextResponse.json({ error: "Invalid Pokemon ID" }, { status: 400 });
  }

  const body = await request.json();
  const { height, weight, description } = body;

  setAboutInfo(pokemonId, {
    height: height ?? null,
    weight: weight ?? null,
    description: description?.trim() ?? null,
  });

  return NextResponse.json({
    data: {
      pokemonId,
      aboutInfo: {
        height: height ?? null,
        weight: weight ?? null,
        description: description?.trim() ?? null,
      },
    },
  });
}

// DELETE /api/pokemon/[id]/about
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const pokemonId = parseInt(id);

  if (isNaN(pokemonId)) {
    return NextResponse.json({ error: "Invalid Pokemon ID" }, { status: 400 });
  }

  deleteAboutInfo(pokemonId);

  return new NextResponse(null, { status: 204 });
}