package uce.edu.ec.repository;

import java.util.List;

import uce.edu.ec.repository.modelo.Vehiculo;

public interface IVehiculoRepository {

    List<Vehiculo> seleccionarTodosLosVehiculos();

    Vehiculo selecionarVehiculoPorPlaca(String placa);

    void insertarVehiculo(Vehiculo vehiculo);

    void actualizarVehiculo(Vehiculo vehiculo);

    void eliminarVehiculo(String placa);
}