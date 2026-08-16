import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import CarouselImage from '@/models/CarouselImage';

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const updatedData = await request.json();

    const result = await CarouselImage.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (result) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error updating carousel image:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const result = await CarouselImage.findByIdAndDelete(id);

    if (result) {
      return NextResponse.json({ message: 'Image deleted successfully' });
    } else {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting carousel image:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 