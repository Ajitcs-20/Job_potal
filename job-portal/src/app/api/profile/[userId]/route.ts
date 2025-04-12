import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock data for development
const mockProfile = {
  id: '123',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 234 567 8900',
  location: 'New York, USA',
  bio: 'Experienced software developer with a passion for building scalable applications.',
  resume: null,
  education: [
    {
      id: '1',
      school: 'University of Technology',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2018',
      endDate: '2022',
    },
  ],
  experience: [
    {
      id: '1',
      company: 'Tech Corp',
      position: 'Software Developer',
      startDate: '2022',
      endDate: 'Present',
      description: 'Working on full-stack development using React and Node.js',
    },
  ],
  skills: [
    { id: '1', name: 'React', level: 'Advanced' },
    { id: '2', name: 'Node.js', level: 'Intermediate' },
    { id: '3', name: 'TypeScript', level: 'Advanced' },
  ],
  savedJobs: [],
};

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // TODO: Replace with actual database query
    return NextResponse.json(mockProfile);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const body = await request.json();
    // TODO: Replace with actual database update
    const updatedProfile = { ...mockProfile, ...body };
    return NextResponse.json(updatedProfile);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
} 