"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Download, Edit, MoreHorizontal, Plus, Search, Trash } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Employee } from "@/types/employee";

interface EmployeeWithPaymentStatus extends Employee {
  paymentStatus: 'PAID' | 'UNPAID';
  lastPaymentDate?: string;
  department: { id: number; name: string; location: string; employeeCount: number; createdDate: string };
}

// Static data for demonstration
const staticEmployees: EmployeeWithPaymentStatus[] = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    department: { 
      id: 1, 
      name: "Engineering",
      location: "New York",
      employeeCount: 25,
      createdDate: "2024-01-01"
    },
    contractType: "Full-time",
    contractLength: "12 months",
    grossAmount: "5000",
    taxDeductions: "500",
    insuranceDeductions: "200",
    otherDeductions: "100",
    paymentStatus: "UNPAID",
    lastPaymentDate: undefined
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phone: "987-654-3210",
    department: { 
      id: 2, 
      name: "Marketing",
      location: "Los Angeles",
      employeeCount: 15,
      createdDate: "2024-01-01"
    },
    contractType: "Part-time",
    contractLength: "6 months",
    grossAmount: "3000",
    taxDeductions: "300",
    insuranceDeductions: "120",
    otherDeductions: "50",
    paymentStatus: "UNPAID",
    lastPaymentDate: undefined
  },
  {
    id: 3,
    firstName: "Mike",
    lastName: "Johnson",
    email: "mike.johnson@example.com",
    phone: "555-123-4567",
    department: { 
      id: 3, 
      name: "Sales",
      location: "Chicago",
      employeeCount: 20,
      createdDate: "2024-01-01"
    },
    contractType: "Contract",
    contractLength: "3 months",
    grossAmount: "4000",
    taxDeductions: "400",
    insuranceDeductions: "160",
    otherDeductions: "80",
    paymentStatus: "UNPAID",
    lastPaymentDate: undefined
  }
];

export default function PaymentsPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<EmployeeWithPaymentStatus[]>(staticEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPayDialogOpen, setIsPayDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeWithPaymentStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const filteredEmployees = employees.filter(
    (employee) =>
      `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePayEmployee = async () => {
    if (!selectedEmployee) return;
    try {
      // Simulate payment process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update employee payment status
      const updatedEmployees = employees.map(emp => 
        emp.id === selectedEmployee.id 
          ? { 
              ...emp, 
              paymentStatus: 'PAID' as const,
              lastPaymentDate: new Date().toISOString().split('T')[0]
            }
          : emp
      );
      
      setEmployees(updatedEmployees);
      alert(`Payment processed successfully for ${selectedEmployee.firstName} ${selectedEmployee.lastName}`);
      setIsPayDialogOpen(false);
    } catch (error: any) {
      console.error("Failed to process payment:", error);
      setError("Failed to process payment. Please try again later.");
    }
  };

  const handleEditPayment = async () => {
    if (!selectedEmployee) return;
    try {
      // Simulate payment update
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`Payment details updated for ${selectedEmployee.firstName} ${selectedEmployee.lastName}`);
      setIsEditDialogOpen(false);
    } catch (error: any) {
      console.error("Failed to update payment:", error);
      setError("Failed to update payment. Please try again later.");
    }
  };

  const handleDeletePayment = async () => {
    if (!selectedEmployee) return;
    try {
      // Simulate payment deletion
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`Payment record deleted for ${selectedEmployee.firstName} ${selectedEmployee.lastName}`);
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      console.error("Failed to delete payment:", error);
      setError("Failed to delete payment. Please try again later.");
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Payment Records", 14, 16);
    doc.autoTable({
      startY: 20,
      head: [["Name", "Email", "Gross Amount", "Deductions", "Net Amount", "Status", "Last Payment"]],
      body: employees.map(emp => [
        `${emp.firstName} ${emp.lastName}`,
        emp.email,
        emp.grossAmount,
        `Tax: ${emp.taxDeductions}, Insurance: ${emp.insuranceDeductions}, Other: ${emp.otherDeductions}`,
        (Number(emp.grossAmount) - Number(emp.taxDeductions) - Number(emp.insuranceDeductions) - Number(emp.otherDeductions)).toString(),
        emp.paymentStatus,
        emp.lastPaymentDate || 'N/A'
      ]),
    });
    doc.save("payments.pdf");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Payments</h2>
          <p className="text-muted-foreground">Manage employee payments and salary processing</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-gray-300 text-yellow-500 hover:bg-gray-100 hover:text-black" onClick={handleExportPDF}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 bg-white border-yellow-300 rounded-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-yellow-500" />
          <Input
            type="search"
            placeholder="Search employees..."
            className="pl-8 bg-gray-900 text-white placeholder-yellow-500 border-none shadow-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <button className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
            <span className="sr-only">Dismiss</span>
            <span className="text-xl">×</span>
          </button>
        </div>
      )}

      <div className="rounded-md border shadow-sm">
        <Table>
          <TableHeader className="bg-gray-100 text-gray-800">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Gross Amount</TableHead>
              <TableHead>Deductions</TableHead>
              <TableHead>Net Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Payment</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  {searchTerm ? "No employees match your search criteria." : "No employees found."}
                </TableCell>
              </TableRow>
            ) : (
              filteredEmployees.map((employee) => (
                <TableRow key={employee.id} className="hover:bg-gray-100 text-gray-800">
                  <TableCell className="font-medium text-gray-900">{`${employee.firstName} ${employee.lastName}`}</TableCell>
                  <TableCell className="text-gray-800">{employee.email}</TableCell>
                  <TableCell className="text-gray-800">${employee.grossAmount}</TableCell>
                  <TableCell className="text-gray-800">
                    Tax: ${employee.taxDeductions}<br />
                    Insurance: ${employee.insuranceDeductions}<br />
                    Other: ${employee.otherDeductions}
                  </TableCell>
                  <TableCell className="text-gray-800">
                    ${(Number(employee.grossAmount) - Number(employee.taxDeductions) - Number(employee.insuranceDeductions) - Number(employee.otherDeductions)).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-gray-800">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      employee.paymentStatus === 'PAID' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {employee.paymentStatus}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-800">{employee.lastPaymentDate || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    {employee.paymentStatus === 'UNPAID' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => {
                          setSelectedEmployee(employee);
                          setIsPayDialogOpen(true);
                        }}
                      >
                        Pay
                      </Button>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                            <DialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => {
                                  e.preventDefault();
                                  setSelectedEmployee(employee);
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Payment Details</DialogTitle>
                                <DialogDescription>Update payment information for the employee.</DialogDescription>
                              </DialogHeader>
                              {selectedEmployee && (
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-grossAmount">Gross Amount</Label>
                                      <Input
                                        id="edit-grossAmount"
                                        type="number"
                                        value={selectedEmployee.grossAmount}
                                        onChange={(e) =>
                                          setSelectedEmployee({
                                            ...selectedEmployee,
                                            grossAmount: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-taxDeductions">Tax Deductions</Label>
                                      <Input
                                        id="edit-taxDeductions"
                                        type="number"
                                        value={selectedEmployee.taxDeductions}
                                        onChange={(e) =>
                                          setSelectedEmployee({
                                            ...selectedEmployee,
                                            taxDeductions: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-insuranceDeductions">Insurance Deductions</Label>
                                      <Input
                                        id="edit-insuranceDeductions"
                                        type="number"
                                        value={selectedEmployee.insuranceDeductions}
                                        onChange={(e) =>
                                          setSelectedEmployee({
                                            ...selectedEmployee,
                                            insuranceDeductions: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-otherDeductions">Other Deductions</Label>
                                      <Input
                                        id="edit-otherDeductions"
                                        type="number"
                                        value={selectedEmployee.otherDeductions}
                                        onChange={(e) =>
                                          setSelectedEmployee({
                                            ...selectedEmployee,
                                            otherDeductions: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleEditPayment} className="bg-gray-100 hover:bg-gray-200 text-black font-semibold">
                                  Save Changes
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                            <DialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => {
                                  e.preventDefault();
                                  setSelectedEmployee(employee);
                                }}
                                className="text-red-600"
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delete Payment Record</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete this payment record? This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              {selectedEmployee && (
                                <div className="py-4">
                                  <p>
                                    You are about to delete the payment record for{" "}
                                    <strong>{`${selectedEmployee.firstName} ${selectedEmployee.lastName}`}</strong>.
                                  </p>
                                </div>
                              )}
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button variant="destructive" onClick={handleDeletePayment}>
                                  Delete
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isPayDialogOpen} onOpenChange={setIsPayDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Payment</DialogTitle>
            <DialogDescription>Review and process payment for the employee.</DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Employee Name</Label>
                <p className="text-sm text-gray-500">{`${selectedEmployee.firstName} ${selectedEmployee.lastName}`}</p>
              </div>
              <div className="space-y-2">
                <Label>Gross Amount</Label>
                <p className="text-sm text-gray-500">${selectedEmployee.grossAmount}</p>
              </div>
              <div className="space-y-2">
                <Label>Deductions</Label>
                <p className="text-sm text-gray-500">
                  Tax: ${selectedEmployee.taxDeductions}<br />
                  Insurance: ${selectedEmployee.insuranceDeductions}<br />
                  Other: ${selectedEmployee.otherDeductions}
                </p>
              </div>
              <div className="space-y-2">
                <Label>Net Amount</Label>
                <p className="text-sm text-gray-500">
                  ${(Number(selectedEmployee.grossAmount) - 
                    Number(selectedEmployee.taxDeductions) - 
                    Number(selectedEmployee.insuranceDeductions) - 
                    Number(selectedEmployee.otherDeductions)).toFixed(2)}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPayDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePayEmployee} className="bg-green-600 hover:bg-green-700 text-white">
              Process Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 