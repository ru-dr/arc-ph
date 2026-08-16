import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import CarouselImage from '@/models/CarouselImage';

const seedImages = [
  {
    number: "001",
    url: "https://ucarecdn.com/8faf3259-8b03-4123-ba97-781b9656a644/DaytoDusk284Rivised.jpg",
    info: "Photography",
    order: 1
  },
  {
    number: "002",
    url: "https://ucarecdn.com/d529e25d-16d7-49e9-a195-ff81a71b15f0/Livingroom.jpg",
    info: "Photography",
    order: 2
  },
  {
    number: "003",
    url: "https://ucarecdn.com/28e8664e-e31a-4945-99b8-f1f796980061/bedroom.jpg",
    info: "Photography",
    order: 3
  },
  {
    number: "004",
    url: "https://ucarecdn.com/872dd2c6-a9ef-4dad-85e9-e45d307fa9f6/Kitchen.jpg",
    info: "Photography",
    order: 4
  },
  {
    number: "005",
    url: "https://ucarecdn.com/72178346-b781-412d-bf5f-ac24c5aa9fa5/Dinning.jpg",
    info: "Photography",
    order: 5
  },
  {
    number: "006",
    url: "https://res.cloudinary.com/dblp9jhyj/image/upload/v1728724911/21_1_rjgp6p.jpg",
    info: "Photography",
    order: 6
  },
  {
    number: "007",
    url: "https://res.cloudinary.com/dblp9jhyj/image/upload/v1728724721/Floor_plan_lot_741-742-743_Rudra_pwm67r.jpg",
    info: "Floor Plan B/W",
    order: 7
  },
  {
    number: "008",
    url: "https://res.cloudinary.com/dblp9jhyj/image/upload/v1728724721/Tapioca_Drive_R1_e6obun.jpg",
    info: "Floor Plan Color",
    order: 8
  }
];

export async function GET() {
  try {
    await dbConnect();

    await CarouselImage.deleteMany({});

    const images = await CarouselImage.insertMany(seedImages);

    return NextResponse.json({
      message: 'Carousel images seeded successfully',
      count: images.length
    });
  } catch (error) {
    console.error('Error seeding carousel images:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 