package com.emp_man.ems.Controllers;

import com.emp_man.ems.Models.Salary;
import com.emp_man.ems.Service.SalaryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salaries")
public class SalaryController {

    private final SalaryService salaryService;

    public SalaryController(SalaryService salaryService) {
        this.salaryService = salaryService;
    }

    @GetMapping
    public List<Salary> getAllSalaries() {
        return salaryService.getAllSalaries();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Salary> getSalaryById(@PathVariable Long id) {
        Salary salary = salaryService.getSalaryById(id);
        return ResponseEntity.ok(salary);
    }

    @PostMapping
    public Salary createSalary(@RequestBody Salary salary) {
        return salaryService.createSalary(salary);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Salary> updateSalary(@PathVariable Long id, @RequestBody Salary salaryDetails) {
        Salary updatedSalary = salaryService.updateSalary(id, salaryDetails);
        return ResponseEntity.ok(updatedSalary);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSalary(@PathVariable Long id) {
        salaryService.deleteSalary(id);
        return ResponseEntity.ok("Salary deleted successfully");
    }
}