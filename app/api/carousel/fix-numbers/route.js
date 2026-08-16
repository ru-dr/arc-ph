import { NextResponse } from "next/server";
import CarouselImage from "@/models/CarouselImage";
import dbConnect from "@/lib/mongodb";

export async function POST() {
  try {
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'This endpoint is only available in development' }, { status: 403 });
    }

    await dbConnect();

    const images = await CarouselImage.find().sort({ order: 1 });

    const updates = await Promise.all(
      images.map(async (image) => {
        const paddedNumber = String(image.order).padStart(3, '0');
        return CarouselImage.findByIdAndUpdate(
          image._id,
          { number: paddedNumber },
          { new: true }
        );
      })
    );

    return NextResponse.json({
      message: `Updated ${updates.length} images`,
      images: updates
    });
  } catch (error) {
    console.error("Error fixing numbers:", error);
    return NextResponse.json(
      { error: "Failed to fix image numbers" },
      { status: 500 }
    );
  }
} 