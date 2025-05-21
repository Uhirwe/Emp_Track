package com.emp_man.ems.Repositories;

import com.emp_man.ems.Models.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
}
