package uce.edu.ec.repository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import uce.edu.ec.repository.modelo.Usuario;

@Transactional
@ApplicationScoped
public class UsuarioRepositoryImpl implements IUsuarioRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional(value = Transactional.TxType.NOT_SUPPORTED)
    public Usuario seleccionarUsuarioPorNombreUsuario(String usuario) {
        try {
            TypedQuery<Usuario> query = this.entityManager.createQuery("SELECT u FROM Usuario u WHERE u.usuario = :usuario", Usuario.class);
            query.setParameter("usuario", usuario);
            return query.getSingleResult();
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    @Transactional(value = Transactional.TxType.NOT_SUPPORTED) // por que no vamos a modificar nada en la base
    public Usuario seleccionarUsuarioPorId(Integer id) {
        try {
            return this.entityManager.find(Usuario.class, id);
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    @Transactional(value = Transactional.TxType.MANDATORY)
    public void insertarUsuario(Usuario usuario) {
        try {
            this.entityManager.persist(usuario);
        } catch (Exception e) {
            throw new UnsupportedOperationException("Error en el metodo 'insertarUsuario'", e);
        }
    }

    @Override
    @Transactional(value = Transactional.TxType.MANDATORY)
    public void actualizarUsuario(Usuario usuario) {
        try {
            this.entityManager.merge(usuario);
        } catch (Exception e) {
            throw new UnsupportedOperationException("Error en el metodo 'actualizarUsuario'", e);
        }
    }

    @Override
    @Transactional(value = Transactional.TxType.MANDATORY)
    public void eliminarUsuario(String usuario) {
        try {
            TypedQuery<Usuario> query = this.entityManager.createQuery("SELECT u FROM Usuario u WHERE u.usuario = :usuario", Usuario.class);
            query.setParameter("usuario", usuario);
            Usuario tmp = query.getSingleResult();
            if (tmp == null) {
                throw new UnsupportedOperationException("No existe el usuario con el nombre: " + usuario);
            }
            this.entityManager.remove(tmp);
        } catch (Exception e) {
            throw new UnsupportedOperationException("Error en el metodo 'eliminarUsuario'", e);
        }
    }

    @Override
    @Transactional(value = Transactional.TxType.MANDATORY)
    public Usuario seleccionarPorUsuarioYContrasenia(String usuario, String contrasenia) {
        try {
            return this.entityManager
                    .createQuery("SELECT u FROM Usuario u WHERE u.usuario = :usuario AND u.contrasenia = :contrasenia",
                            Usuario.class)
                    .setParameter("usuario", usuario)
                    .setParameter("contrasenia", contrasenia)
                    .getSingleResult();
        } catch (Exception e) {
            return Usuario.NoExiste();
        }
    }

}
