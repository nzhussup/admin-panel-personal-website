package com.nzhussup.baseservice.model;

//import jakarta.validation.constraints.NotBlank;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class AuthRequest {

//    @NotBlank
    private String username;

    private String password;
}
