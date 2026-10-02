package com.hotel.management.dto;

public class AuthResponse {
    private String token;
    private String username;
    private String fullName;
    private String role;

    private String phone;
    private String email;

    public AuthResponse() {}

    public AuthResponse(String token, String username, String fullName, String role) {
        this.token = token;
        this.username = username;
        this.fullName = fullName;
        this.role = role;
    }

    public AuthResponse(String token, String username, String fullName, String role, String phone, String email) {
        this.token = token;
        this.username = username;
        this.fullName = fullName;
        this.role = role;
        this.phone = phone;
        this.email = email;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
