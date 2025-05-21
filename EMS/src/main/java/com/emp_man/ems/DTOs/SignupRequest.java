package com.emp_man.ems.DTOs;

import java.util.HashSet;
import java.util.Set;

public class SignupRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private String password;

    private static final Set<String> ALLOWED_ROLES = new HashSet<>(Set.of("HR Administrator", "Department Manager", "Employee"));

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setRole(String role) {
        if (role == null || !ALLOWED_ROLES.contains(role)) {
            throw new IllegalArgumentException("Role must be one of: HR Administrator, Department Manager, Employee");
        }
        this.role = role;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public String getPassword() {
        return password;
    }
}
