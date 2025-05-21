package com.emp_man.ems.Repositories;

import com.emp_man.ems.Models.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
}
