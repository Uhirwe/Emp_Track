// src/types/employee.ts
export interface Department {
  id: number;
  name: string;
  manager: string;
  description?: string;
  employeeCount: number;
  createdDate?: string;
  employees?: Employee[];
}

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department: Department;
}

export interface Attendance {
  id: number;
  employee: Employee;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'LEAVE';
}

export interface LeaveRequest {
  id: number;
  employee: Employee;
  startDate: string;
  endDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  reason: string;
}

export interface Salary {
  id: number;
  employee: Employee;
  department: Department;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  paymentDate: string;
  status: 'PENDING' | 'PAID';
}