package com.emp_man.ems;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {
		"com.emp_man.ems",
		"com.emp_man.ems.config",
		"com.emp_man.ems.security",
		"com.emp_man.ems.Controllers",
		"com.emp_man.ems.Service",
		"com.emp_man.ems.Repositories",
		"com.emp_man.ems.Models",
		"com.emp_man.ems.DTOs"
})
public class EmsApplication {

	public static void main(String[] args) {
		SpringApplication.run(EmsApplication.class, args);
	}
}