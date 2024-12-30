package com.nzhussup.backendadminpanel.controller;


import com.nzhussup.backendadminpanel.model.AuthRequest;
import com.nzhussup.backendadminpanel.model.AuthResponse;
import com.nzhussup.backendadminpanel.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth/v1")
public class AuthController {

    private final BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(12);
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;



    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        try {
            UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getUsername());
            if (!bCryptPasswordEncoder.matches(authRequest.getPassword(), userDetails.getPassword())) {
                throw new BadCredentialsException("Bad credentials");
            }
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
            );
            String token = jwtUtil.generateToken(authRequest.getUsername());
            Long expiration = jwtUtil.getExpirationTime(token);
            return ResponseEntity.ok(new AuthResponse(token, expiration));
        } catch (BadCredentialsException | UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/hello")
    public String hello() {
        return "Hello World!";
    }

}
