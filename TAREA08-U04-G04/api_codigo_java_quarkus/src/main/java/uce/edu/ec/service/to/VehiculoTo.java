package uce.edu.ec.service.to;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehiculoTo {
 private Integer id;
   
    private String placa;

    private String marca;

    private String fechaFabricacion;

    private String color;

    private Integer costo;

    private Boolean activo;

    private Boolean oculto;
  
    private String fotoUrl;

    public static VehiculoTo noExiste(){
        VehiculoTo vehiculoTo = new VehiculoTo();
        vehiculoTo.setId(-1);
        vehiculoTo.setPlaca("No existe");
        vehiculoTo.setMarca("No existe");
        vehiculoTo.setFechaFabricacion("No existe");
        vehiculoTo.setColor("No existe");
        vehiculoTo.setCosto(-1);
        vehiculoTo.setActivo(false);
        vehiculoTo.setOculto(false);
        vehiculoTo.setFotoUrl("No existe");
        return vehiculoTo;
        }
}
