import { Employee, Department, Attendance, LeaveRequest, Salary } from "@/types/employee";

// Use a function to get the API base URL to ensure it's evaluated at runtime
const getApiBaseUrl = () => {
  // For client-side code, use window.location if env vars aren't available
  if (typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_API_URL) {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    return `${protocol}//${hostname}:8080/api`;
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
};

// Get headers with token from localStorage if available
const getHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    // If no token is found, redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
    throw new Error('No authentication token found');
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const employeeApi = {
  // Get all employees
  async getAllEmployees(): Promise<Employee[]> {
    try {
      const response = await fetch(`${getApiBaseUrl()}/employees`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        console.error('Server response:', response.status, response.statusText);
        throw new Error(
          response.status === 401 ? '401: Unauthorized' : `Failed to fetch employees: ${response.status} ${response.statusText}`,
        );
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  },
  async getAllEmployeesByUserId(userId: number): Promise<Employee[]> {
    try {
      const response = await fetch(`${getApiBaseUrl()}/employees/user/${userId}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        console.error('Server response:', response.status, response.statusText);
        throw new Error(
          response.status === 401 ? '401: Unauthorized' : `Failed to fetch employees: ${response.status} ${response.statusText}`,
        );
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  },

  // Get a single employee by ID
  async getEmployeeById(id: number): Promise<Employee> {
    try {
      const response = await fetch(`${getApiBaseUrl()}/employees/${id}`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        console.error('Server response:', response.status, response.statusText);
        throw new Error(
          response.status === 401 ? '401: Unauthorized' : `Failed to fetch employee: ${response.status} ${response.statusText}`,
        );
      }

      return response.json();
    } catch (error) {
      console.error(`Error fetching employee with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new employee
  async createEmployee(employee: Omit<Employee, 'id'>): Promise<Employee> {
    try {
      const response = await fetch(`${getApiBaseUrl()}/employees`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(employee),
      });

      if (!response.ok) {
        console.error('Server response:', response.status, response.statusText);
        throw new Error(
          response.status === 401 ? '401: Unauthorized' : `Failed to create employee: ${response.status} ${response.statusText}`,
        );
      }

      return response.json();
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  },

  // Update an existing employee
  async updateEmployee(id: number, employee: Partial<Employee>): Promise<Employee> {
    try {
      const response = await fetch(`${getApiBaseUrl()}/employees/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(employee),
      });

      if (!response.ok) {
        console.error('Server response:', response.status, response.statusText);
        throw new Error(
          response.status === 401 ? '401: Unauthorized' : `Failed to update employee: ${response.status} ${response.statusText}`,
        );
      }

      return response.json();
    } catch (error) {
      console.error(`Error updating employee with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete an employee
  async deleteEmployee(id: number): Promise<void> {
    try {
      const response = await fetch(`${getApiBaseUrl()}/employees/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('401: Unauthorized');
        } else {
          throw new Error(`Failed to delete employee: ${response.status} ${response.statusText}`);
        }
      }
    } catch (error) {
      if (!(error instanceof Error && error.message.includes('401'))) {
        console.error(`Error deleting employee with ID ${id}:`, error);
      }
      throw error;
    }
  },
};

export const departmentApi = {
  getAllDepartments: async (): Promise<Department[]> => {
    const response = await fetch(`${getApiBaseUrl()}/departments`, {
      headers: getHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch departments');
    }
    console.log("this is the department data: "+JSON.stringify(response))
    return response.json();
  },

  getDepartmentById: async (id: number): Promise<Department> => {
    const response = await fetch(`${getApiBaseUrl()}/departments/${id}`, {
      headers: getHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch department');
    }
    return response.json();
  },

  createDepartment: async (department: Omit<Department, 'id'>): Promise<Department> => {
    const response = await fetch(`${getApiBaseUrl()}/departments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(department),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create department');
    }
    return response.json();
  },

  updateDepartment: async (id: number, department: Partial<Department>): Promise<Department> => {
    const response = await fetch(`${getApiBaseUrl()}/departments/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(department),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update department');
    }
    return response.json();
  },

  deleteDepartment: async (id: number): Promise<void> => {
    const response = await fetch(`${getApiBaseUrl()}/departments/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete department');
    }
  },

  updateEmployeeCount: async (departmentId: number, countChange: number): Promise<void> => {
    const response = await fetch(`${getApiBaseUrl()}/departments/${departmentId}/employee-count`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ countChange }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update employee count');
    }
  }
};

export const attendanceApi = {
  getAllAttendances: async (): Promise<Attendance[]> => {
    const response = await fetch(`${getApiBaseUrl()}/attendances`, {
      headers: getHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch attendances');
    }
    return response.json();
  },

  getAttendanceById: async (id: number): Promise<Attendance> => {
    const response = await fetch(`${getApiBaseUrl()}/attendances/${id}`, {
      headers: getHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch attendance');
    }
    return response.json();
  },

  createAttendance: async (attendance: Omit<Attendance, 'id'>): Promise<Attendance> => {
    const response = await fetch(`${getApiBaseUrl()}/attendances`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(attendance),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create attendance');
    }
    return response.json();
  },

  updateAttendance: async (id: number, attendance: Partial<Attendance>): Promise<Attendance> => {
    const response = await fetch(`${getApiBaseUrl()}/attendances/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(attendance),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update attendance');
    }
    return response.json();
  },

  deleteAttendance: async (id: number): Promise<void> => {
    const response = await fetch(`${getApiBaseUrl()}/attendances/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete attendance');
    }
  }
};

export const leaveRequestApi = {
  getAllLeaveRequests: async (): Promise<LeaveRequest[]> => {
    const response = await fetch(`${getApiBaseUrl()}/leave-requests`, {
      headers: getHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch leave requests');
    }
    return response.json();
  },

  getLeaveRequestById: async (id: number): Promise<LeaveRequest> => {
    const response = await fetch(`${getApiBaseUrl()}/leave-requests/${id}`, {
      headers: getHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch leave request');
    }
    return response.json();
  },

  createLeaveRequest: async (leaveRequest: Omit<LeaveRequest, 'id'>): Promise<LeaveRequest> => {
    const response = await fetch(`${getApiBaseUrl()}/leave-requests`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(leaveRequest),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create leave request');
    }
    return response.json();
  },

  updateLeaveRequest: async (id: number, leaveRequest: Partial<LeaveRequest>): Promise<LeaveRequest> => {
    const response = await fetch(`${getApiBaseUrl()}/leave-requests/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(leaveRequest),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update leave request');
    }
    return response.json();
  },

  deleteLeaveRequest: async (id: number): Promise<void> => {
    const response = await fetch(`${getApiBaseUrl()}/leave-requests/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete leave request');
    }
  }
};

export const salaryApi = {
  getAllSalaries: async (): Promise<Salary[]> => {
    const response = await fetch(`${getApiBaseUrl()}/salaries`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch salaries');
    }
    return response.json();
  },

  getSalaryById: async (id: number): Promise<Salary> => {
    const response = await fetch(`${getApiBaseUrl()}/salaries/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch salary');
    }
    return response.json();
  },

  createSalary: async (salary: Omit<Salary, 'id'>): Promise<Salary> => {
    const response = await fetch(`${getApiBaseUrl()}/salaries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(salary),
    });
    if (!response.ok) {
      throw new Error('Failed to create salary');
    }
    return response.json();
  },

  updateSalary: async (id: number, salary: Partial<Salary>): Promise<Salary> => {
    const response = await fetch(`${getApiBaseUrl()}/salaries/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(salary),
    });
    if (!response.ok) {
      throw new Error('Failed to update salary');
    }
    return response.json();
  },

  deleteSalary: async (id: number): Promise<void> => {
    const response = await fetch(`${getApiBaseUrl()}/salaries/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete salary');
    }
  },
};