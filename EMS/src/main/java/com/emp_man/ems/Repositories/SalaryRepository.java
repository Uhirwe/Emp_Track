package com.emp_man.ems.Repositories;

import com.emp_man.ems.Models.Salary;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SalaryRepository extends JpaRepository<Salary, Long> {
}