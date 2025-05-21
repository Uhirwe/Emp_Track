import { NextResponse } from 'next/server'
import { Employee, Department } from '@/types/employee'
import { employees, departments } from '../../data'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id)
  const employee = employees.find(e => e.id === id)
  
  if (!employee) {
    return NextResponse.json({ error: 'Employee not found' }, { status: 404 })
  }
  
  return NextResponse.json(employee)
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id)
  const updatedEmployee: Partial<Employee> = await request.json()
  
  const index = employees.findIndex(e => e.id === id)
  if (index === -1) {
    return NextResponse.json({ error: 'Employee not found' }, { status: 404 })
  }
  
  // If department is being changed, update employee counts
  if (updatedEmployee.department && updatedEmployee.department.id !== employees[index].department.id) {
    // Decrement old department's count
    const oldDepartment = departments.find(d => d.id === employees[index].department.id)
    if (oldDepartment) {
      oldDepartment.employeeCount = Math.max(0, (oldDepartment.employeeCount || 0) - 1)
    }
    
    // Increment new department's count
    const newDepartment = departments.find(d => d.id === updatedEmployee.department?.id)
    if (newDepartment) {
      newDepartment.employeeCount = (newDepartment.employeeCount || 0) + 1
    }
  }
  
  employees[index] = { ...employees[index], ...updatedEmployee }
  return NextResponse.json(employees[index])
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id)
  const index = employees.findIndex(e => e.id === id)
  
  if (index === -1) {
    return NextResponse.json({ error: 'Employee not found' }, { status: 404 })
  }
  
  // Decrement the department's employee count
  const employee = employees[index]
  const department = departments.find(d => d.id === employee.department.id)
  if (department) {
    department.employeeCount = Math.max(0, (department.employeeCount || 0) - 1)
  }
  
  employees.splice(index, 1)
  return NextResponse.json({ message: 'Employee deleted successfully' })
} 