import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "../../utils/config";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    // Accept both single and multiple files
    const files = data.getAll("file") as File[];
    console.log("files", files);

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    // Use the SDK's fileArray method for multiple files
    const upload = await pinata.upload.public.fileArray(files);
    // upload.cid is the directory CID
    const url = await pinata.gateways.public.convert(upload.cid);

    return NextResponse.json({ cid: upload.cid, url }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 