import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Recipe from '@/models/Recipe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET single recipe by ID or slug
export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = await params;
    
    let recipe;
    
    // Check if it's a valid MongoDB ObjectId or a slug
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      recipe = await Recipe.findById(id).lean();
    } else {
      recipe = await Recipe.findOne({ slug: id }).lean();
    }

    if (!recipe) {
      return NextResponse.json({ error: 'Recette non trouvée' }, { status: 404 });
    }

    // Increment views
    await Recipe.findByIdAndUpdate(recipe._id, { $inc: { views: 1 } });

    return NextResponse.json({ recipe });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update recipe (protected)
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    await dbConnect();
    
    const { id } = await params;
    const body = await request.json();

    const recipe = await Recipe.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!recipe) {
      return NextResponse.json({ error: 'Recette non trouvée' }, { status: 404 });
    }

    return NextResponse.json({ recipe });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE recipe (protected)
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    await dbConnect();
    
    const { id } = await params;

    const recipe = await Recipe.findByIdAndDelete(id);

    if (!recipe) {
      return NextResponse.json({ error: 'Recette non trouvée' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Recette supprimée avec succès' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
