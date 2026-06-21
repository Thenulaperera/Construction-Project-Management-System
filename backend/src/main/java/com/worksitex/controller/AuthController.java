package com.worksitex.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.worksitex.model.User;
import com.worksitex.payload.request.LoginRequest;
import com.worksitex.payload.request.SignupRequest;
import com.worksitex.repository.UserRepository;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        // Allow login by username or email
        var userOpt = userRepository.findByUsername(loginRequest.getUsername());
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(loginRequest.getUsername());
        }

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(simpleMessage("Invalid credentials"));
        }

        User user = userOpt.get();
        if (!user.getPassword().equals(loginRequest.getPassword())) {
            return ResponseEntity.status(401).body(simpleMessage("Invalid credentials"));
        }

        Map<String, Object> body = new HashMap<>();
        body.put("id", user.getId());
        body.put("username", user.getUsername());
        body.put("email", user.getEmail());
        body.put("firstName", user.getFirstName());
        body.put("lastName", user.getLastName());
        body.put("role", user.getRole());
        body.put("message", "Login successful");
        return ResponseEntity.ok(body);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body(simpleMessage("Username is already taken"));
        }
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(simpleMessage("Email is already in use"));
        }

        User user = new User(
                signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                // store plain password for simplicity (no hashing)
                signUpRequest.getPassword(),
                signUpRequest.getFirstName(),
                signUpRequest.getLastName());
        user.setPhone(signUpRequest.getPhone());
        user.setRole(signUpRequest.getRole().iterator().next());
        userRepository.save(user);

        return ResponseEntity.ok(simpleMessage("User registered successfully"));
    }

    private Map<String, String> simpleMessage(String message) {
        Map<String, String> map = new HashMap<>();
        map.put("message", message);
        return map;
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        var users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.status(404).body(simpleMessage("User not found"));
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok(simpleMessage("User deleted successfully"));
    }


}
