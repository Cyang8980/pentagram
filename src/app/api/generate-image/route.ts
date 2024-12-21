import { NextResponse } from "next/server";

import { put } from "@vercel/blob";

import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;

    // TODO: Call your Image Generation API here
    // For now, we'll just echo back the text
    
    console.log(text);
    const url = new URL("https://cyang8980--sd-demo-modal-generate.modal.run/");
    
    url.searchParams.set("prompt", text)

    console.log("Requesting URL: ", url.toString());
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "X-API-KEY": process.env.API_KEY || "",
        Accept: "image/jpeg"
      },
    })
    console.log("before request if statement");
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Response:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }
    console.log("after request if statement");
    const imageBuffer = await response.arrayBuffer();

    console.log("before randomUUID")
    const filename = `${crypto.randomUUID()}.jpg`


    console.log("before blob")
    const blob = await put(filename, imageBuffer, {
      access: "public",
      contentType: "image/jpeg",
    })
    console.log("after blob")
    return NextResponse.json({
      success: true,
      imageUrl: blob.url,
    });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
      
    );
  }
}