package uce.edu.ec.repository.modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "usuario")
@Data  // para seters, getters, ToString, EqualsAndHashCode etc 
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @SequenceGenerator(name = "usuario_id_seq", sequenceName = "usuario_id_seq", allocationSize = 1)
    @GeneratedValue(generator = "usuario_id_seq", strategy = GenerationType.SEQUENCE)
    @Column(name = "usua_id")
    private Integer id;
    @Column(name = "usua_usuario", unique = true)
    private String usuario;
    @Column(name = "usua_nombre")
    private String nombre;
    @Column(name = "usua_apellido")
    private String apellido;
    @Column(name = "usua_contrasenia")
    private String contrasenia;
    @Column(name = "usua_imagen")
    private String imagen;
    @Column(name = "usua_correo")
    private String correo;
    
    public static Usuario NoExiste(){
        Usuario usuario = new Usuario();
        usuario.setId(-1);
        usuario.setUsuario("No existe");
        usuario.setNombre("No existe");
        usuario.setApellido("No existe");
        usuario.setContrasenia("No existe");
        usuario.setImagen("No existe");
        usuario.setCorreo("No existe");
        return usuario;
       }


}
