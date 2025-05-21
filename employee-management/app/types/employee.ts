export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  department: Department;
  position: string;
  joinDate: string;
  createdDate: string;
  updatedDate: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  createdDate: string;
  updatedDate: string;
}

export interface LeaveRequest {
  id: string;
  employee: Employee;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  createdDate: string;
  updatedDate: string;
}

export interface Attendance {
  id: string;
  employee: Employee;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'LEAVE';
  checkIn: string;
  checkOut: string;
  createdDate: string;
  updatedDate: string;
}

export interface Salary {
  id: string;
  employee: Employee;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  paymentDate: string;
  status: 'PENDING' | 'PAID';
  createdDate: string;
  updatedDate: string;
} 