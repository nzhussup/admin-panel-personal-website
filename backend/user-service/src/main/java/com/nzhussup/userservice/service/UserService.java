package com.nzhussup.userservice.service;

import com.nzhussup.userservice.dto.UserDTO;
import com.nzhussup.userservice.exceptions.LastAdminException;
import com.nzhussup.userservice.exceptions.UserAlreadyExistsException;
import com.nzhussup.userservice.exceptions.UserNotFoundException;
import com.nzhussup.userservice.model.User;
import com.nzhussup.userservice.repository.UserRepository;
import com.nzhussup.userservice.utils.BcryptUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User findById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User not found"));
    }

    public User findByUsername(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UserNotFoundException("User not found");
        }
        return user;
    }

    public User save(UserDTO userDTO) {

        if (userDTO.getRole() == null) {
            userDTO.setRole("ROLE_USER");
        }
        try {
            User user = findByUsername(userDTO.getUsername());
            throw new UserAlreadyExistsException("User already exists");
        } catch (UserNotFoundException e) {
            User user = User.builder()
                    .username(userDTO.getUsername())
                    .password(BcryptUtil.encryptPassword(userDTO.getPassword()))
                    .role(userDTO.getRole())
                    .build();
            return userRepository.save(user);
        }
    }

    public User update(Authentication authentication, UserDTO userDTO) {

        if (!authentication.getName().equals(userDTO.getUsername())) {
            if (!authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) {
                throw new AccessDeniedException("Invalid request. User is not admin nor trying to manage it's own account");
            }
        }

        if (userDTO.getRole() == null) {
            userDTO.setRole("ROLE_USER");
        }

        try {
            User user = findByUsername(userDTO.getUsername());
            user.setUsername(userDTO.getUsername());
            user.setPassword(BcryptUtil.encryptPassword(userDTO.getPassword()));
            user.setRole(userDTO.getRole());
            return userRepository.save(user);
        } catch (UserNotFoundException e) {
            throw new UserNotFoundException("User not found");
        }
    }

    public void delete(Authentication authentication, UserDTO userDTO) {

        if (!authentication.getName().equals(userDTO.getUsername())) {
            if (!authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) {
                throw new AccessDeniedException("Invalid request. User is not admin nor trying to manage it's own account");
            }
        }

        User user = findByUsername(userDTO.getUsername());

        if (user.getRole().contains("ROLE_ADMIN")) {
            List<User> admins = userRepository.findByRoleContaining("ROLE_ADMIN");
            if (admins.size() <= 1) {
                throw new LastAdminException("Can't delete last admin");
            }
        }

        try {
            userRepository.deleteById(user.getId());
        } catch (UserNotFoundException e) {
            throw new UserNotFoundException("User not found");
        }
    }

}
