import { NextRequest, NextResponse } from "next/server";
import { getNickname, setNickname, deleteNickname } from "@/app/lib/db";

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/pokemon/[id]/nickname
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const pokemonId = parseInt(id);

  if (isNaN(pokemonId)) {
    return NextResponse.json({ error: "Invalid Pokemon ID" }, { status: 400 });
  }

  const nickname = getNickname(pokemonId);

  return NextResponse.json({
    data: {
      pokemonId,
      nickname,
    },
  });
}

// PUT /api/pokemon/[id]/nickname
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const pokemonId = parseInt(id);

  if (isNaN(pokemonId)) {
    return NextResponse.json({ error: "Invalid Pokemon ID" }, { status: 400 });
  }

  const body = await request.json();
  const { nickname } = body;

  if (!nickname || typeof nickname !== "string") {
    return NextResponse.json({ error: "Nickname is required" }, { status: 400 });
  }

  setNickname(pokemonId, nickname.trim());

  return NextResponse.json({
    data: {
      pokemonId,
      nickname: nickname.trim(),
    },
  });
}

// DELETE /api/pokemon/[id]/nickname
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const pokemonId = parseInt(id);

  if (isNaN(pokemonId)) {
    return NextResponse.json({ error: "Invalid Pokemon ID" }, { status: 400 });
  }

  deleteNickname(pokemonId);

  return new NextResponse(null, { status: 204 });
}