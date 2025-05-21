"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, ChevronDown, Download, Edit, MoreHorizontal, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { salaryApi, employeeApi } from "@/lib/api/employee"
import { Salary, Employee, Department } from "@/types/employee"
import { format } from "date-fns"

export default function SalaryPage() {
  const router = useRouter()
  const [salaries, setSalaries] = useState<Salary[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<Salary | null>(null)
  const [newRecord, setNewRecord] = useState<{
    employee: Employee;
    department: Department;
    basicSalary: string;
    allowances: string;
    deductions: string;
    paymentDate: string;
    status: 'PENDING' | 'PAID';
  }>({
    employee: {} as Employee,
    department: {} as Department,
    basicSalary: "",
    allowances: "",
    deductions: "",
    paymentDate: format(new Date(), "yyyy-MM-dd"),
    status: "PENDING",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [salaryData, employeeData] = await Promise.all([
        salaryApi.getAllSalaries(),
        employeeApi.getAllEmployees()
      ])
      setSalaries(salaryData)
      setEmployees(employeeData)
    } catch (error: any) {
      console.error("Failed to load data:", error)
      if (error.message?.includes("401")) {
        setError("Authentication required. Please log in.")
        router.push("/auth/login")
      } else {
        setError("Failed to load data. Please try again later.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const filteredRecords = salaries.filter(
    (record) =>
      `${record.employee.firstName} ${record.employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.department.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddRecord = async () => {
    try {
      if (!newRecord.employee.id) {
        setError("Employee is required")
        return
      }
      if (!newRecord.basicSalary || !newRecord.allowances || !newRecord.deductions) {
        setError("All salary fields are required")
        return
      }

      const netSalary = Number(newRecord.basicSalary) + Number(newRecord.allowances) - Number(newRecord.deductions)

      await salaryApi.createSalary({
        employee: newRecord.employee,
        department: newRecord.employee.department,
        basicSalary: Number(newRecord.basicSalary),
        allowances: Number(newRecord.allowances),
        deductions: Number(newRecord.deductions),
        netSalary,
        paymentDate: newRecord.paymentDate,
        status: newRecord.status,
      })

      const updatedSalaries = await salaryApi.getAllSalaries()
      setSalaries(updatedSalaries)

      setIsAddDialogOpen(false)
      setNewRecord({
        employee: {} as Employee,
        department: {} as Department,
        basicSalary: "",
        allowances: "",
        deductions: "",
        paymentDate: format(new Date(), "yyyy-MM-dd"),
        status: "PENDING",
      })
    } catch (error: any) {
      console.error("Failed to add salary record:", error)
      setError(error.message || "Failed to add salary record. Please try again later.")
    }
  }

  const handleEditRecord = async () => {
    if (!selectedRecord) return
    try {
      if (!selectedRecord.employee.id) {
        setError("Employee is required")
        return
      }
      if (!selectedRecord.basicSalary || !selectedRecord.allowances || !selectedRecord.deductions) {
        setError("All salary fields are required")
        return
      }

      const netSalary = selectedRecord.basicSalary + selectedRecord.allowances - selectedRecord.deductions

      await salaryApi.updateSalary(selectedRecord.id, {
        ...selectedRecord,
        netSalary,
      })

      const updatedSalaries = await salaryApi.getAllSalaries()
      setSalaries(updatedSalaries)
      setIsEditDialogOpen(false)
      setSelectedRecord(null)
    } catch (error: any) {
      console.error("Failed to update salary record:", error)
      setError(error.message || "Failed to update salary record. Please try again later.")
    }
  }

  const handleDeleteRecord = async () => {
    if (!selectedRecord) return

    try {
      await salaryApi.deleteSalary(selectedRecord.id)
      const updatedSalaries = await salaryApi.getAllSalaries()
      setSalaries(updatedSalaries)
      setIsEditDialogOpen(false)
      setSelectedRecord(null)
    } catch (error: any) {
      console.error("Failed to delete salary record:", error)
      setError(error.message || "Failed to delete salary record. Please try again later.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Salary Management</h2>
          <p className="text-muted-foreground">Manage employee salaries and payments</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "MMMM yyyy") : <span>Select month</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-black">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-white hover:bg-white/90 text-black font-semibold">
                <Plus className="mr-2 h-4 w-4" />
                New Salary
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Salary Record</DialogTitle>
                <DialogDescription>Add a new salary record for an employee.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="employee">Employee</Label>
                  <Select
                    value={newRecord.employee.id?.toString()}
                    onValueChange={(value) => {
                      const employee = employees.find(e => e.id.toString() === value)
                      if (employee) {
                        setNewRecord({ ...newRecord, employee, department: employee.department })
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id.toString()}>
                          {employee.firstName} {employee.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="basicSalary">Basic Salary</Label>
                    <Input
                      id="basicSalary"
                      type="number"
                      value={newRecord.basicSalary}
                      onChange={(e) => setNewRecord({ ...newRecord, basicSalary: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="allowances">Allowances</Label>
                    <Input
                      id="allowances"
                      type="number"
                      value={newRecord.allowances}
                      onChange={(e) => setNewRecord({ ...newRecord, allowances: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deductions">Deductions</Label>
                    <Input
                      id="deductions"
                      type="number"
                      value={newRecord.deductions}
                      onChange={(e) => setNewRecord({ ...newRecord, deductions: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paymentDate">Payment Date</Label>
                    <Input
                      id="paymentDate"
                      type="date"
                      value={newRecord.paymentDate}
                      onChange={(e) => setNewRecord({ ...newRecord, paymentDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={newRecord.status}
                      onValueChange={(value) => setNewRecord({ ...newRecord, status: value as 'PENDING' | 'PAID' })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="PAID">Paid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddRecord}>Add Record</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search employees..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Filter
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>All Departments</DropdownMenuItem>
            {Array.from(new Set(employees.map(e => e.department.name))).map((dept) => (
              <DropdownMenuItem key={dept}>{dept}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
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

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-gray-100 text-gray-800">
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Basic Salary</TableHead>
                <TableHead>Allowances</TableHead>
                <TableHead>Deductions</TableHead>
                <TableHead>Net Salary</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    {searchTerm ? "No salary records match your search criteria." : "No salary records found. Add some records to get started."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredRecords.map((record) => (
                  <TableRow key={record.id} className="hover:bg-gray-100 text-gray-800">
                    <TableCell className="font-medium text-gray-900">{record.employee.firstName} {record.employee.lastName}</TableCell>
                    <TableCell className="text-gray-800">{record.department.name}</TableCell>
                    <TableCell className="text-gray-800">${record.basicSalary.toLocaleString()}</TableCell>
                    <TableCell className="text-gray-800">${record.allowances.toLocaleString()}</TableCell>
                    <TableCell className="text-gray-800">${record.deductions.toLocaleString()}</TableCell>
                    <TableCell className="text-gray-800">${record.netSalary.toLocaleString()}</TableCell>
                    <TableCell className="text-gray-800">{new Date(record.paymentDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          record.status === "PAID" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {record.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
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
                                  e.preventDefault()
                                  setSelectedRecord(record)
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Salary Record</DialogTitle>
                                <DialogDescription>Update salary information.</DialogDescription>
                              </DialogHeader>
                              {selectedRecord && (
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-basicSalary">Basic Salary</Label>
                                      <Input
                                        id="edit-basicSalary"
                                        type="number"
                                        value={selectedRecord.basicSalary}
                                        onChange={(e) =>
                                          setSelectedRecord({ ...selectedRecord, basicSalary: Number(e.target.value) })
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-allowances">Allowances</Label>
                                      <Input
                                        id="edit-allowances"
                                        type="number"
                                        value={selectedRecord.allowances}
                                        onChange={(e) =>
                                          setSelectedRecord({ ...selectedRecord, allowances: Number(e.target.value) })
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-deductions">Deductions</Label>
                                      <Input
                                        id="edit-deductions"
                                        type="number"
                                        value={selectedRecord.deductions}
                                        onChange={(e) =>
                                          setSelectedRecord({ ...selectedRecord, deductions: Number(e.target.value) })
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-paymentDate">Payment Date</Label>
                                      <Input
                                        id="edit-paymentDate"
                                        type="date"
                                        value={selectedRecord.paymentDate}
                                        onChange={(e) =>
                                          setSelectedRecord({ ...selectedRecord, paymentDate: e.target.value })
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-status">Status</Label>
                                      <Select
                                        value={selectedRecord.status}
                                        onValueChange={(value) =>
                                          setSelectedRecord({ ...selectedRecord, status: value as 'PENDING' | 'PAID' })
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="PENDING">Pending</SelectItem>
                                          <SelectItem value="PAID">Paid</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                </div>
                              )}
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleEditRecord}>Save Changes</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <DropdownMenuItem onClick={() => handleDeleteRecord()}>
                            <Download className="mr-2 h-4 w-4" />
                            Download Slip
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
