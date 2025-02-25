package uce.edu.ec.service;

import uce.edu.ec.service.to.UsuarioTo;

public interface IUsuarioToService {

    UsuarioTo buscarUsuarioToPorNombreUsuario(String usuario);

    UsuarioTo buscarUsuarioToPorId(Integer id);

    void guardarUsuarioTo(UsuarioTo UsuarioTo);

    void actualizarUsuarioTo(UsuarioTo UsuarioTo);

    void borrarUsuarioTo(String usuario);

    UsuarioTo buscarPorUsuarioToYContrasenia(String usuario, String contrasenia);

}
