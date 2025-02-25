package uce.edu.ec.repository;

import uce.edu.ec.repository.modelo.Usuario;

public interface IUsuarioRepository {

    Usuario seleccionarUsuarioPorNombreUsuario(String usuario);

    Usuario seleccionarUsuarioPorId(Integer id);

    void insertarUsuario(Usuario usuario);

    void actualizarUsuario(Usuario usuario);

    void eliminarUsuario(String usuario);

    Usuario seleccionarPorUsuarioYContrasenia(String usuario, String contrasenia);

}
