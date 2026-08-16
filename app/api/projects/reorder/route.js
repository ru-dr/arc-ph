import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';

export async function PUT(request) {
  try {
    await dbConnect();
    const { projects } = await request.json();

    const updatePromises = projects.map(project =>
      Project.findByIdAndUpdate(
        project._id,
        { order: project.order },
        { new: true }
      )
    );

    await Promise.all(updatePromises);

    return NextResponse.json({
      message: 'Projects reordered successfully',
      projectsUpdated: projects.length
    });
  } catch (error) {
    console.error('Error reordering projects:', error);
    return NextResponse.json({
      error: 'Failed to reorder projects',
      details: error.message
    }, { status: 500 });
  }
} 