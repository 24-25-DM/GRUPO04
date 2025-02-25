package uce.edu.ec.service.to;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data  // para seters, getters, ToString, EqualsAndHashCode etc 
@NoArgsConstructor
@AllArgsConstructor

public class UsuarioTo {

    private Integer id;
    
    private String usuario;

    private String nombre;

    private String apellido;

    private String contrasenia;
   
    private String imagen;
  
    private String correo;


    public static UsuarioTo noExiste(){
        UsuarioTo usuarioTo = new UsuarioTo();
        usuarioTo.setId(-1);
        usuarioTo.setUsuario("No existe");
        usuarioTo.setNombre("No existe");
        usuarioTo.setApellido("No existe");
        usuarioTo.setContrasenia("No existe");
        usuarioTo.setImagen("No existe");
        usuarioTo.setCorreo("No existe");
        return usuarioTo;
        }

}
