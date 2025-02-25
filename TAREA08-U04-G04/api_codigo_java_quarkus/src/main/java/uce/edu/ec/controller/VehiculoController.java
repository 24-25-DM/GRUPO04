package uce.edu.ec.controller;


import java.util.List;

import jakarta.ws.rs.Produces;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import uce.edu.ec.service.IVehisuloService;
import uce.edu.ec.service.to.VehiculoTo;

@Path("/vehiculo")
public class VehiculoController {

    @Inject
    private IVehisuloService iVehisuloService;

    @GET
    @Path("/todos")
    @Produces(MediaType.APPLICATION_JSON)
    public Response buscarTodosLosVehiculos() {
        try {
            List<VehiculoTo> tmp = iVehisuloService.buscarTodosLosVehiculos();
            if (tmp != null && !tmp.isEmpty()) {
                return Response.ok(tmp)
                        .header("mensaje", "Vehiculos encontrados")
                        .build();
            } else {
                return Response.status(Response.Status.NOT_FOUND)
                        .header("mensaje", "Vehiculos no encontrados")
                        .entity(VehiculoTo.noExiste())
                        .build();
            }
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .header("mensaje", "Error en el servidor")
                    .entity(VehiculoTo.noExiste())
                    .build();
        }
    }

    @GET
    @Path("/{placa}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response buscarVehiculoPorPlaca(@PathParam("placa") String placa) {
        try {
            VehiculoTo tmp = iVehisuloService.buscarVehiculoPorPlaca(placa);
            if (tmp != null) {
                return Response.ok(tmp)
                        .header("mensaje", "Vehiculo encontrado")
                        .build();
            } else {
                return Response.status(Response.Status.NOT_FOUND)
                        .header("mensaje", "Vehiculo no encontrado")
                        .entity(VehiculoTo.noExiste())
                        .build();
            }
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .header("mensaje", "Error en el servidor")
                    .entity(VehiculoTo.noExiste())
                    .build();
        }
    }

    @POST
    @Path("")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response insertarVehiculo(VehiculoTo vehiculoTo) {
        try {
            iVehisuloService.guardarVehiculo(vehiculoTo);
            return Response.ok(vehiculoTo)
                    .header("mensaje", "Vehiculo insertado")
                    .build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .header("mensaje", "Error en el servidor")
                    .entity(VehiculoTo.noExiste())
                    .build();
        }
    }

    @PUT
    @Path("/{placa}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response actualizarVehiculo(@PathParam("placa") String placa, VehiculoTo vehiculoTo) {
        try {
            VehiculoTo vehiculoToTmp = iVehisuloService.buscarVehiculoPorPlaca(placa);
            if (vehiculoToTmp == null) {
                return Response.status(Response.Status.NOT_FOUND)
                        .header("mensaje", "Vehiculo no encontrado")
                        .entity(VehiculoTo.noExiste())
                        .build();
            }
           else{
            vehiculoTo.setId(vehiculoToTmp.getId());
            vehiculoTo.setPlaca(placa);
            iVehisuloService.actualizarVehiculo(vehiculoTo);
            return Response.ok(vehiculoTo)
                    .header("mensaje", "Vehiculo actualizado")
                    .build();
           }
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .header("mensaje", "Error en el servidor")
                    .entity(VehiculoTo.noExiste())
                    .build();
        }
    }

    @DELETE
    @Path("/{placa}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response eliminarVehiculo(@PathParam("placa") String placa) {
        try {
            VehiculoTo vehiculoToTmp = iVehisuloService.buscarVehiculoPorPlaca(placa);
            if (vehiculoToTmp == null || vehiculoToTmp.getPlaca().equals("No existe")) {
                return Response.status(Response.Status.NOT_FOUND)
                        .header("mensaje", "Vehiculo no encontrado")
                        .entity(VehiculoTo.noExiste())
                        .build();
            } else {
                iVehisuloService.borrarVehiculo(placa);
                return Response.ok(vehiculoToTmp)
                        .header("mensaje", "Vehiculo eliminado")
                        .build();
            }
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .header("mensaje", "Error en el servidor")
                    .entity(VehiculoTo.noExiste())
                    .build();
        }

    }
 
    

}
