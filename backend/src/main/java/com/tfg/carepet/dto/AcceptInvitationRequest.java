package com.tfg.carepet.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AcceptInvitationRequest {

    @NotNull(message = "El campo aceptar/rechazar es obligatorio")
    private Boolean accept;
}
