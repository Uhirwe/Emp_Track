"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Download, Edit, MoreHorizontal, Plus, Search, Trash, Upload } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import { departmentApi } from "@/lib/api/employee";
import { Department } from "@/types/employee";

export default function DepartmentsPage() {
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("name-asc");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [newDepartment, setNewDepartment] = useState({
    name: "",
    location: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await departmentApi.getAllDepartments();
      console.log("this is the department data: ", data);
      setDepartments(data);
    } catch (error: any) {
      console.error("Failed to load departments:", error);
      if (error.message?.includes("401")) {
        setError("Authentication required. Please log in.");
        router.push("/auth/login");
      } else {
        setError("Failed to load departments. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const sortedDepartments = [...departments].sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "employeeCount-desc":
        return b.employeeCount - a.employeeCount;
      case "employeeCount-asc":
        return a.employeeCount - b.employeeCount;
      case "createdDate-desc":
        return (b.createdDate ? new Date(b.createdDate).getTime() : 0) - (a.createdDate ? new Date(a.createdDate).getTime() : 0);
      case "createdDate-asc":
        return (a.createdDate ? new Date(a.createdDate).getTime() : 0) - (b.createdDate ? new Date(b.createdDate).getTime() : 0);
      default:
        return 0;
    }
  });

  const filteredDepartments = sortedDepartments.filter(
    (department) =>
      department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (department.location?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  const handleAddDepartment = async () => {
    try {
      if (!newDepartment.name.trim()) {
        setError("Department name is required");
        return;
      }
      if (!newDepartment.location.trim()) {
        setError("Department location is required");
        return;
      }

      const departmentData = {
        name: newDepartment.name.trim(),
        location: newDepartment.location.trim(),
        employeeCount: 0
      };

      await departmentApi.createDepartment(departmentData);
      await loadDepartments();
      setIsAddDialogOpen(false);
      setNewDepartment({ name: "", location: "" });
    } catch (error: any) {
      console.error("Failed to add department:", error);
      setError(error.message || "Failed to add department. Please try again later.");
    }
  };

  const handleEditDepartment = async () => {
    if (!selectedDepartment) return;
    try {
      if (!selectedDepartment.name.trim()) {
        setError("Department name is required");
        return;
      }
      if (!selectedDepartment.location.trim()) {
        setError("Department location is required");
        return;
      }

      const departmentData = {
        name: selectedDepartment.name.trim(),
        location: selectedDepartment.location.trim(),
        employeeCount: selectedDepartment.employeeCount
      };

      await departmentApi.updateDepartment(selectedDepartment.id, departmentData);
      await loadDepartments();
      setIsEditDialogOpen(false);
      setSelectedDepartment(null);
    } catch (error: any) {
      console.error("Failed to update department:", error);
      setError(error.message || "Failed to update department. Please try again later.");
    }
  };

  const handleDeleteDepartment = async () => {
    if (!selectedDepartment) return;
    
    try {
      await departmentApi.deleteDepartment(selectedDepartment.id);
      await loadDepartments();
      setIsDeleteDialogOpen(false);
      setSelectedDepartment(null);
      setError(null);
    } catch (error) {
      console.error('Failed to delete department:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete department');
      setIsDeleteDialogOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Departments</h2>
          <p className="text-muted-foreground">Manage your organization's departments</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Export
            </Button>
           
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gray-100 hover:bg-gray-200 text-black font-semibold">
                <Plus className="mr-2 h-4 w-4" />
                New Department
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Department</DialogTitle>
                <DialogDescription>Fill in the details to add a new department to your organization.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Department Name</Label>
                  <Input
                    id="name"
                    value={newDepartment.name}
                    onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Department Location</Label>
                  <Input
                    id="location"
                    value={newDepartment.location}
                    onChange={(e) => setNewDepartment({ ...newDepartment, location: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddDepartment}>Add Department</Button>
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
            placeholder="Search departments..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Sort
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setSortBy("name-asc")}>Name (A-Z)</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setSortBy("name-desc")}>Name (Z-A)</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setSortBy("employeeCount-desc")}>Employee Count (High-Low)</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setSortBy("employeeCount-asc")}>Employee Count (Low-High)</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setSortBy("createdDate-desc")}>Date Created (Newest)</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setSortBy("createdDate-asc")}>Date Created (Oldest)</DropdownMenuItem>
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
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Employees</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDepartments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    {searchTerm ? "No departments match your search criteria." : "No departments found. Add some departments to get started."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredDepartments.map((department) => (
                  <TableRow key={department.id} className="hover:bg-gray-100 text-gray-800">
                    <TableCell className="font-medium text-gray-900">{department.name}</TableCell>
                    <TableCell className="text-gray-800">{department.location}</TableCell>
                    <TableCell className="text-gray-800">{department.employeeCount}</TableCell>
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
                                  e.preventDefault();
                                  setSelectedDepartment(department);
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Department</DialogTitle>
                                <DialogDescription>Update department information.</DialogDescription>
                              </DialogHeader>
                              {selectedDepartment && (
                                <div className="grid gap-4 py-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-name">Department Name</Label>
                                    <Input
                                      id="edit-name"
                                      value={selectedDepartment.name}
                                      onChange={(e) =>
                                        setSelectedDepartment({ ...selectedDepartment, name: e.target.value })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-location">Department Location</Label>
                                    <Input
                                      id="edit-location"
                                      value={selectedDepartment.location || ""}
                                      onChange={(e) =>
                                        setSelectedDepartment({ ...selectedDepartment, location: e.target.value })
                                      }
                                    />
                                  </div>
                                </div>
                              )}
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleEditDepartment} className="bg-gray-100 hover:bg-gray-200 text-black font-semibold">
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
                                  setSelectedDepartment(department);
                                }}
                                className="text-red-600"
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delete Department</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete this department? This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              {selectedDepartment && (
                                <div className="py-4">
                                  <p>
                                    You are about to delete <strong>{selectedDepartment.name}</strong> department with{" "}
                                    {selectedDepartment.employeeCount} employees.
                                  </p>
                                  {selectedDepartment.employeeCount > 0 && (
                                    <p className="mt-2 text-sm text-red-600">
                                      This department has employees. Please reassign them before deleting.
                                    </p>
                                  )}
                                </div>
                              )}
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={handleDeleteDepartment}
                                  disabled={(selectedDepartment?.employeeCount ?? 0) > 0}
                                >
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
  );
}