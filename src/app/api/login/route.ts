import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { phoneNumber } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { message: "Nomor handphone wajib diisi" },
        { status: 400 }
      );
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("id, phone_number, name, sip_username, sip_domain, sip_password")
      .eq("phone_number", phoneNumber)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { message: "Nomor tidak terdaftar di server VoIP Kamailio" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: "Login berhasil",
      user,
    });
  } catch {
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
