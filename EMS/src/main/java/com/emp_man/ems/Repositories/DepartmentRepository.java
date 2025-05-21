package com.emp_man.ems.Repositories;
import com.emp_man.ems.Models.Department;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
}