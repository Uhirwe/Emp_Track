import { NextResponse } from 'next/server'
import { departments } from '../../../data'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id)
  const { countChange } = await request.json()
  
  const department = departments.find(d => d.id === id)
  if (!department) {
    return NextResponse.json({ error: 'Department not found' }, { status: 404 })
  }
  
  department.employeeCount = Math.max(0, (department.employeeCount || 0) + countChange)
  return NextResponse.json(department)
} 