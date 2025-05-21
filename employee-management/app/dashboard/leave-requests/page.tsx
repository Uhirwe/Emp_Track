"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronDown, Download, Edit, MoreHorizontal, Plus, Search, X } from "lucide-react"

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
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { leaveRequestApi, employeeApi } from "@/lib/api/employee"
import { LeaveRequest, Employee } from "@/types/employee"

export default function LeaveRequestsPage() {
  const router = useRouter()
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null)
  const [newRequest, setNewRequest] = useState<{
    employee: Employee;
    startDate: string;
    endDate: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    reason: string;
  }>({
    employee: {} as Employee,
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
    status: 'PENDING',
    reason: '',
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
      const [leaveRequestData, employeeData] = await Promise.all([
        leaveRequestApi.getAllLeaveRequests(),
        employeeApi.getAllEmployees()
      ])
      console.log('Loaded employees:', employeeData)
      setLeaveRequests(leaveRequestData)
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

  const filteredRequests = leaveRequests.filter(
    (request) =>
      `${request.employee.firstName} ${request.employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.employee.department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddRequest = async () => {
    try {
      if (!newRequest.employee.id) {
        setError("Employee is required")
        return
      }
      if (!newRequest.startDate || !newRequest.endDate) {
        setError("Start date and end date are required")
        return
      }
      if (!newRequest.reason) {
        setError("Reason is required")
        return
      }

      await leaveRequestApi.createLeaveRequest({
        employee: newRequest.employee,
        startDate: newRequest.startDate,
        endDate: newRequest.endDate,
        status: newRequest.status,
        reason: newRequest.reason
      })

      const updatedRequests = await leaveRequestApi.getAllLeaveRequests()
      setLeaveRequests(updatedRequests)

      setIsAddDialogOpen(false)
      setNewRequest({
        employee: {} as Employee,
        startDate: format(new Date(), "yyyy-MM-dd"),
        endDate: format(new Date(), "yyyy-MM-dd"),
        status: 'PENDING',
        reason: '',
      })
    } catch (error: any) {
      console.error("Failed to add leave request:", error)
      setError(error.message || "Failed to add leave request. Please try again later.")
    }
  }

  const handleEditRequest = async () => {
    if (!selectedRequest) return
    try {
      if (!selectedRequest.employee.id) {
        setError("Employee is required")
        return
      }
      if (!selectedRequest.startDate || !selectedRequest.endDate) {
        setError("Start date and end date are required")
        return
      }
      if (!selectedRequest.reason) {
        setError("Reason is required")
        return
      }

      await leaveRequestApi.updateLeaveRequest(selectedRequest.id, selectedRequest)
      const updatedRequests = await leaveRequestApi.getAllLeaveRequests()
      setLeaveRequests(updatedRequests)
      setIsEditDialogOpen(false)
      setSelectedRequest(null)
    } catch (error: any) {
      console.error("Failed to update leave request:", error)
      setError(error.message || "Failed to update leave request. Please try again later.")
    }
  }

  const handleDeleteRequest = async () => {
    if (!selectedRequest) return

    try {
      await leaveRequestApi.deleteLeaveRequest(selectedRequest.id)
      const updatedRequests = await leaveRequestApi.getAllLeaveRequests()
      setLeaveRequests(updatedRequests)
      setIsDeleteDialogOpen(false)
      setSelectedRequest(null)
    } catch (error: any) {
      console.error("Failed to delete leave request:", error)
      setError(error.message || "Failed to delete leave request. Please try again later.")
    }
  }

  const handleApproveRequest = async (request: LeaveRequest) => {
    try {
      await leaveRequestApi.updateLeaveRequest(request.id, {
        ...request,
        status: 'APPROVED'
      })
      const updatedRequests = await leaveRequestApi.getAllLeaveRequests()
      setLeaveRequests(updatedRequests)
    } catch (error: any) {
      console.error("Failed to approve leave request:", error)
      setError(error.message || "Failed to approve leave request. Please try again later.")
    }
  }

  const handleRejectRequest = async (request: LeaveRequest) => {
    try {
      await leaveRequestApi.updateLeaveRequest(request.id, {
        ...request,
        status: 'REJECTED'
      })
      const updatedRequests = await leaveRequestApi.getAllLeaveRequests()
      setLeaveRequests(updatedRequests)
    } catch (error: any) {
      console.error("Failed to reject leave request:", error)
      setError(error.message || "Failed to reject leave request. Please try again later.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Leave Requests</h2>
          <p className="text-muted-foreground">Manage employee leave requests</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-black">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-white hover:bg-white/90 text-black font-semibold">
                <Plus className="mr-2 h-4 w-4" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Leave Request</DialogTitle>
                <DialogDescription>Submit a new leave request for an employee.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="employee">Employee</Label>
                  <Select
                    value={newRequest.employee.id?.toString()}
                    onValueChange={(value) => {
                      const employee = employees.find(e => e.id.toString() === value)
                      if (employee) {
                        setNewRequest({ ...newRequest, employee })
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newRequest.startDate}
                      onChange={(e) => setNewRequest({ ...newRequest, startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={newRequest.endDate}
                      onChange={(e) => setNewRequest({ ...newRequest, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea
                    id="reason"
                    value={newRequest.reason}
                    onChange={(e) => setNewRequest({ ...newRequest, reason: e.target.value })}
                    placeholder="Enter the reason for leave"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newRequest.status}
                    onValueChange={(value) => setNewRequest({ ...newRequest, status: value as LeaveRequest['status'] })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="APPROVED">Approved</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddRequest}>Submit Request</Button>
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
            placeholder="Search leave requests..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Status
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>All Statuses</DropdownMenuItem>
            <DropdownMenuItem>Pending</DropdownMenuItem>
            <DropdownMenuItem>Approved</DropdownMenuItem>
            <DropdownMenuItem>Rejected</DropdownMenuItem>
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
            <TableHeader className="bg-gray-900 text-white">
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-white">
                    {searchTerm ? "No leave requests match your search criteria." : "No leave requests found. Add some requests to get started."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map((request) => (
                  <TableRow key={request.id} className="hover:bg-gray-800 text-white">
                    <TableCell className="font-medium text-white">{request.employee.firstName} {request.employee.lastName}</TableCell>
                    <TableCell className="text-white">{request.employee.department.name}</TableCell>
                    <TableCell className="text-white">
                      {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-white">{request.reason}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          request.status === "APPROVED"
                            ? "bg-green-100 text-green-800"
                            : request.status === "REJECTED"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {request.status}
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
                                  setSelectedRequest(request)
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Leave Request</DialogTitle>
                                <DialogDescription>Update leave request information.</DialogDescription>
                              </DialogHeader>
                              {selectedRequest && (
                                <div className="grid gap-4 py-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-employee">Employee</Label>
                                    <Select
                                      value={selectedRequest.employee.id.toString()}
                                      onValueChange={(value) => {
                                        const employee = employees.find(e => e.id.toString() === value)
                                        if (employee) {
                                          setSelectedRequest({ ...selectedRequest, employee })
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
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-startDate">Start Date</Label>
                                      <Input
                                        id="edit-startDate"
                                        type="date"
                                        value={selectedRequest.startDate}
                                        onChange={(e) =>
                                          setSelectedRequest({ ...selectedRequest, startDate: e.target.value })
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-endDate">End Date</Label>
                                      <Input
                                        id="edit-endDate"
                                        type="date"
                                        value={selectedRequest.endDate}
                                        onChange={(e) =>
                                          setSelectedRequest({ ...selectedRequest, endDate: e.target.value })
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-reason">Reason</Label>
                                    <Textarea
                                      id="edit-reason"
                                      value={selectedRequest.reason}
                                      onChange={(e) =>
                                        setSelectedRequest({ ...selectedRequest, reason: e.target.value })
                                      }
                                      placeholder="Enter the reason for leave"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-status">Status</Label>
                                    <Select
                                      value={selectedRequest.status}
                                      onValueChange={(value) =>
                                        setSelectedRequest({ ...selectedRequest, status: value as LeaveRequest['status'] })
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="PENDING">Pending</SelectItem>
                                        <SelectItem value="APPROVED">Approved</SelectItem>
                                        <SelectItem value="REJECTED">Rejected</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              )}
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleEditRequest} className="bg-white hover:bg-white/90 text-black font-semibold">
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
                                  setSelectedRequest(request)
                                }}
                                className="text-red-600"
                              >
                                <X className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delete Leave Request</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete this leave request? This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              {selectedRequest && (
                                <div className="py-4">
                                  <p>
                                    You are about to delete the leave request for{" "}
                                    <strong>
                                      {selectedRequest.employee.firstName} {selectedRequest.employee.lastName}
                                    </strong>{" "}
                                    from {new Date(selectedRequest.startDate).toLocaleDateString()} to{" "}
                                    {new Date(selectedRequest.endDate).toLocaleDateString()}.
                                  </p>
                                </div>
                              )}
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button variant="destructive" onClick={handleDeleteRequest}>
                                  Delete
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          {request.status === "PENDING" && (
                            <>
                              <DropdownMenuItem onClick={() => handleApproveRequest(request)}>
                                <Check className="mr-2 h-4 w-4 text-green-600" />
                                <span className="text-green-600">Approve</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleRejectRequest(request)}>
                                <X className="mr-2 h-4 w-4 text-red-600" />
                                <span className="text-red-600">Reject</span>
                              </DropdownMenuItem>
                            </>
                          )}
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
