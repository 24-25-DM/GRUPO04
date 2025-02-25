package uce.edu.ec.service;

import java.util.List;

import uce.edu.ec.service.to.VehiculoTo;



public interface IVehisuloService {


    List<VehiculoTo> buscarTodosLosVehiculos();

    VehiculoTo buscarVehiculoPorPlaca(String placa);

    void guardarVehiculo(VehiculoTo vehiculoTo);

    void actualizarVehiculo(VehiculoTo vehiculoTo);

    void borrarVehiculo(String placa);

}
