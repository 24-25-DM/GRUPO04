package uce.edu.ec.service;

import java.util.function.Function;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import uce.edu.ec.repository.IUsuarioRepository;
import uce.edu.ec.repository.modelo.Usuario;
import uce.edu.ec.service.to.UsuarioTo;

@ApplicationScoped
public class UsuarioServiceImpl implements IUsuarioToService{

    @Inject
    private IUsuarioRepository iUsuarioRepository;
    //Convertir de  UsuarioTo y Usuario

    private Function<UsuarioTo, Usuario> convertirUsuarioToAUsuario = UsuarioTo -> {
        Usuario usuario = new Usuario();
        usuario.setId(UsuarioTo.getId());
        usuario.setUsuario(UsuarioTo.getUsuario());
        usuario.setNombre(UsuarioTo.getNombre());
        usuario.setApellido(UsuarioTo.getApellido());
        usuario.setContrasenia(UsuarioTo.getContrasenia());
        usuario.setImagen(UsuarioTo.getImagen());
        usuario.setCorreo(UsuarioTo.getCorreo());
        return usuario;


    };

    ///Convertir de Usuario y UsuarioTo
    private Function<Usuario, UsuarioTo> convertirUsuarioAUsuarioTo = Usuario -> {
        UsuarioTo usuarioTo = new UsuarioTo();
        usuarioTo.setId(Usuario.getId());
        usuarioTo.setUsuario(Usuario.getUsuario());
        usuarioTo.setNombre(Usuario.getNombre());
        usuarioTo.setApellido(Usuario.getApellido());
        usuarioTo.setContrasenia(Usuario.getContrasenia());
        usuarioTo.setImagen(Usuario.getImagen());
        usuarioTo.setCorreo(Usuario.getCorreo());
        return usuarioTo;
        };


    @Override
    @Transactional(value = Transactional.TxType.REQUIRES_NEW)
    public UsuarioTo buscarUsuarioToPorNombreUsuario(String usuario) {
        Usuario tmp = iUsuarioRepository.seleccionarUsuarioPorNombreUsuario(usuario);
        if (tmp == null) {
            return UsuarioTo.noExiste();
        }
        return convertirUsuarioAUsuarioTo.apply(tmp);
    }

    @Override
    @Transactional(value = Transactional.TxType.REQUIRES_NEW)
    public UsuarioTo buscarUsuarioToPorId(Integer id) {
        Usuario tmp = iUsuarioRepository.seleccionarUsuarioPorId(id);
        if(tmp == null){
            return UsuarioTo.noExiste();
        }
        return convertirUsuarioAUsuarioTo.apply(tmp);
    }

    @Override
    @Transactional(value = Transactional.TxType.REQUIRES_NEW)
    public void guardarUsuarioTo(UsuarioTo UsuarioTo) {
        Usuario tmp = convertirUsuarioToAUsuario.apply(UsuarioTo);
        iUsuarioRepository.insertarUsuario(tmp);
    }

    @Override
    @Transactional(value = Transactional.TxType.REQUIRES_NEW)
    public void actualizarUsuarioTo(UsuarioTo UsuarioTo) {
        Usuario tmp = convertirUsuarioToAUsuario.apply(UsuarioTo);
        iUsuarioRepository.actualizarUsuario(tmp);
    }

    @Override
    @Transactional(value = Transactional.TxType.REQUIRES_NEW)
    public void borrarUsuarioTo(String usuario) {
        iUsuarioRepository.eliminarUsuario(usuario);
    }

    @Override
    @Transactional(value = Transactional.TxType.REQUIRES_NEW)
    public UsuarioTo buscarPorUsuarioToYContrasenia(String usuario, String contrasenia) {
        Usuario tmp = iUsuarioRepository.seleccionarPorUsuarioYContrasenia(usuario, contrasenia);
        return convertirUsuarioAUsuarioTo.apply(tmp);
    }

}
