import { NextResponse } from 'next/server'
import { Employee, Department } from '@/types/employee'
import { employees, departments } from '../data'

export async function GET() {
  return NextResponse.json(employees)
}

export async function POST(request: Request) {
  const newEmployee: Omit<Employee, 'id'> = await request.json()
  const id = Math.max(...employees.map(e => e.id)) + 1
  const employee: Employee = { ...newEmployee, id }
  employees.push(employee)
  
  // Update the department's employee count
  const department = departments.find(d => d.id === employee.department.id)
  if (department) {
    department.employeeCount = (department.employeeCount || 0) + 1
  }
  
  return NextResponse.json(employee, { status: 201 })
} 