package com.emp_man.ems.Controllers;


import com.emp_man.ems.DTOs.LoginRequest;
import com.emp_man.ems.DTOs.JwtResponse;
import com.emp_man.ems.DTOs.LoginResponse;
import com.emp_man.ems.DTOs.SignupRequest;
import com.emp_man.ems.Service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        authService.signup(request);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

}
