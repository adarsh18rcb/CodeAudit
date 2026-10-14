package com.aicodereview.service;

import com.aicodereview.dto.AuthResponse;
import com.aicodereview.dto.LoginRequest;
import com.aicodereview.dto.RegisterRequest;
import com.aicodereview.model.User;
import com.aicodereview.repository.UserRepository;
import com.aicodereview.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final org.springframework.security.core.userdetails.UserDetailsService userDetailsService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        User user = User.builder().name(request.getName()).email(request.getEmail()).password(passwordEncoder.encode(request.getPassword())).build();
        userRepository.save(user);
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails);
        return AuthResponse.builder().token(token).userId(user.getId()).name(user.getName()).email(user.getEmail()).build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails);
        return AuthResponse.builder().token(token).userId(user.getId()).name(user.getName()).email(user.getEmail()).build();
    }
}
