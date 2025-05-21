import { NextResponse } from 'next/server'
import { Department } from '@/types/employee'
import { departments, employees } from '../../data'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id)
  const department = departments.find(d => d.id === id)
  
  if (!department) {
    return NextResponse.json({ error: 'Department not found' }, { status: 404 })
  }
  
  // Calculate actual employee count
  const actualEmployeeCount = employees.filter(e => e.department.id === id).length
  department.employeeCount = actualEmployeeCount
  
  return NextResponse.json(department)
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id)
  const updatedDepartment: Partial<Department> = await request.json()
  
  const index = departments.findIndex(d => d.id === id)
  if (index === -1) {
    return NextResponse.json({ error: 'Department not found' }, { status: 404 })
  }
  
  departments[index] = { ...departments[index], ...updatedDepartment }
  return NextResponse.json(departments[index])
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const index = departments.findIndex(d => d.id === id)
    
    if (index === -1) {
      return NextResponse.json({ error: 'Department not found' }, { status: 404 })
    }
    
    // Calculate actual employee count
    const actualEmployeeCount = employees.filter(e => e.department.id === id).length
    console.log(`Department ${id} has ${actualEmployeeCount} employees`); // Debug log
    
    if (actualEmployeeCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete department with ${actualEmployeeCount} employees. Please reassign or remove all employees first.` }, 
        { status: 400 }
      )
    }
    
    // Remove the department
    departments.splice(index, 1)
    
    // Return success response
    return NextResponse.json({ 
      message: 'Department deleted successfully',
      departmentId: id
    })
  } catch (error) {
    console.error('Error deleting department:', error)
    return NextResponse.json(
      { error: 'An error occurred while deleting the department' },
      { status: 500 }
    )
  }
} 