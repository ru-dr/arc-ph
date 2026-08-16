import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { handleApiError } from "@/lib/errorHandler";
import CarouselImage from "@/models/CarouselImage";

export async function PUT(request) {
  try {
    await dbConnect();
    const { images } = await request.json();

    const updatePromises = images.map((image) =>
      CarouselImage.findByIdAndUpdate(image._id, { order: image.order })
    );

    await Promise.all(updatePromises);

    return NextResponse.json({ message: "Images reordered successfully" });
  } catch (error) {
    return handleApiError(error);
  }
} 