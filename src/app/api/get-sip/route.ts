import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

  try {

    const { phoneNumber } = await req.json();

    const { data, error } = await supabase
      .from("users")
      .select("sip_username, sip_domain")
      .eq("phone_number", phoneNumber)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { message: "Nomor tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);

  } catch (err) {

    console.log("GET SIP ERROR", err);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}