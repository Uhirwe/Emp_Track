package com.emp_man.ems.Repositories;
import com.emp_man.ems.Models.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
}
