"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, ChevronDown, Download, Edit, MoreHorizontal, Plus, Search, Trash } from "lucide-react"

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
import { format } from "date-fns"
import { attendanceApi, employeeApi } from "@/lib/api/employee"
import { Attendance, Employee } from "@/types/employee"

export default function AttendancePage() {
  const router = useRouter()
  const [attendances, setAttendances] = useState<Attendance[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null)
  const [newAttendance, setNewAttendance] = useState<{
    employee: Employee;
    date: string;
    status: 'PRESENT' | 'ABSENT' | 'LATE' | 'LEAVE';
  }>({
    employee: {} as Employee,
    date: format(new Date(), "yyyy-MM-dd"),
    status: 'PRESENT',
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
      const [attendanceData, employeeData] = await Promise.all([
        attendanceApi.getAllAttendances(),
        employeeApi.getAllEmployees()
      ])
      setAttendances(attendanceData)
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

  const filteredAttendances = attendances.filter(
    (attendance) =>
      `${attendance.employee.firstName} ${attendance.employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendance.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendance.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddAttendance = async () => {
    try {
      if (!newAttendance.employee.id) {
        setError("Employee is required")
        return
      }
      if (!newAttendance.date) {
        setError("Date is required")
        return
      }

      await attendanceApi.createAttendance({
        employee: newAttendance.employee,
        date: newAttendance.date,
        status: newAttendance.status
      })

      const updatedAttendances = await attendanceApi.getAllAttendances()
      setAttendances(updatedAttendances)

      setIsAddDialogOpen(false)
      setNewAttendance({
        employee: {} as Employee,
        date: format(new Date(), "yyyy-MM-dd"),
        status: 'PRESENT',
      })
    } catch (error: any) {
      console.error("Failed to add attendance:", error)
      setError(error.message || "Failed to add attendance. Please try again later.")
    }
  }

  const handleEditAttendance = async () => {
    if (!selectedAttendance) return
    try {
      if (!selectedAttendance.employee.id) {
        setError("Employee is required")
        return
      }
      if (!selectedAttendance.date) {
        setError("Date is required")
        return
      }

      await attendanceApi.updateAttendance(selectedAttendance.id, selectedAttendance)
      const updatedAttendances = await attendanceApi.getAllAttendances()
      setAttendances(updatedAttendances)
      setIsEditDialogOpen(false)
      setSelectedAttendance(null)
    } catch (error: any) {
      console.error("Failed to update attendance:", error)
      setError(error.message || "Failed to update attendance. Please try again later.")
    }
  }

  const handleDeleteAttendance = async () => {
    if (!selectedAttendance) return

    try {
      await attendanceApi.deleteAttendance(selectedAttendance.id)
      const updatedAttendances = await attendanceApi.getAllAttendances()
      setAttendances(updatedAttendances)
      setIsDeleteDialogOpen(false)
      setSelectedAttendance(null)
    } catch (error: any) {
      console.error("Failed to delete attendance:", error)
      setError(error.message || "Failed to delete attendance. Please try again later.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Attendance</h2>
          <p className="text-muted-foreground">Track and manage employee attendance</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
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
                New Record
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Attendance Record</DialogTitle>
                <DialogDescription>Add a new attendance record for an employee.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="employee">Employee</Label>
                  <Select
                    value={newAttendance.employee.id?.toString()}
                    onValueChange={(value) => {
                      const employee = employees.find(e => e.id.toString() === value)
                      if (employee) {
                        setNewAttendance({ ...newAttendance, employee })
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
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newAttendance.date}
                    onChange={(e) => setNewAttendance({ ...newAttendance, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newAttendance.status}
                    onValueChange={(value) => setNewAttendance({ ...newAttendance, status: value as Attendance['status'] })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PRESENT">Present</SelectItem>
                      <SelectItem value="ABSENT">Absent</SelectItem>
                      <SelectItem value="LATE">Late</SelectItem>
                      <SelectItem value="LEAVE">Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddAttendance}>Add Record</Button>
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
            <DropdownMenuItem>All Statuses</DropdownMenuItem>
            <DropdownMenuItem>Present</DropdownMenuItem>
            <DropdownMenuItem>Absent</DropdownMenuItem>
            <DropdownMenuItem>Late</DropdownMenuItem>
            <DropdownMenuItem>Leave</DropdownMenuItem>
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
                <TableHead>Date</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendances.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    {searchTerm ? "No attendance records match your search criteria." : "No attendance records found. Add some records to get started."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredAttendances.map((attendance) => (
                  <TableRow key={attendance.id} className="hover:bg-gray-100 text-gray-800">
                    <TableCell className="font-medium text-gray-900">{attendance.employee.firstName} {attendance.employee.lastName}</TableCell>
                    <TableCell className="text-gray-800">{attendance.employee.department.name}</TableCell>
                    <TableCell className="text-gray-800">{new Date(attendance.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-gray-800">{attendance.checkIn}</TableCell>
                    <TableCell className="text-gray-800">{attendance.checkOut}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          attendance.status === "PRESENT"
                            ? "bg-green-100 text-green-800"
                            : attendance.status === "ABSENT"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {attendance.status}
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
                                  setSelectedAttendance(attendance)
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Attendance Record</DialogTitle>
                                <DialogDescription>Update attendance information.</DialogDescription>
                              </DialogHeader>
                              {selectedAttendance && (
                                <div className="grid gap-4 py-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-employee">Employee</Label>
                                    <Select
                                      value={selectedAttendance.employee.id.toString()}
                                      onValueChange={(value) => {
                                        const employee = employees.find(e => e.id.toString() === value)
                                        if (employee) {
                                          setSelectedAttendance({ ...selectedAttendance, employee })
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
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-date">Date</Label>
                                    <Input
                                      id="edit-date"
                                      type="date"
                                      value={selectedAttendance.date}
                                      onChange={(e) =>
                                        setSelectedAttendance({ ...selectedAttendance, date: e.target.value })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-status">Status</Label>
                                    <Select
                                      value={selectedAttendance.status}
                                      onValueChange={(value) =>
                                        setSelectedAttendance({ ...selectedAttendance, status: value as Attendance['status'] })
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="PRESENT">Present</SelectItem>
                                        <SelectItem value="ABSENT">Absent</SelectItem>
                                        <SelectItem value="LATE">Late</SelectItem>
                                        <SelectItem value="LEAVE">Leave</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              )}
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleEditAttendance} className="bg-white hover:bg-white/90 text-black font-semibold">
                                  Save Changes
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                            <DialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => {
                                  e.preventDefault()
                                  setSelectedAttendance(attendance)
                                }}
                                className="text-red-600"
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delete Attendance</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete this attendance record? This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              {selectedAttendance && (
                                <div className="py-4">
                                  <p>
                                    You are about to delete the attendance record for{" "}
                                    <strong>
                                      {selectedAttendance.employee.firstName} {selectedAttendance.employee.lastName}
                                    </strong>{" "}
                                    on {new Date(selectedAttendance.date).toLocaleDateString()}.
                                  </p>
                                </div>
                              )}
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button variant="destructive" onClick={handleDeleteAttendance}>
                                  Delete
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
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
