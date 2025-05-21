import { NextResponse } from 'next/server'
import { Department } from '@/types/employee'
import { departments } from '../data'

export async function GET() {
  return NextResponse.json(departments)
}

export async function POST(request: Request) {
  const newDepartment: Omit<Department, 'id'> = await request.json()
  const id = Math.max(...departments.map(d => d.id), 0) + 1
  const department: Department = { 
    ...newDepartment, 
    id,
    employeeCount: 0,
    createdDate: new Date().toISOString()
  }
  departments.push(department)
  return NextResponse.json(department, { status: 201 })
} 