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
@Table(name = "vehiculo")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vehiculo {
    @Id
    @SequenceGenerator(name = "vehiculo_id_seq", sequenceName = "vehiculo_id_seq", allocationSize = 1)
    @GeneratedValue(generator = "vehiculo_id_seq", strategy = GenerationType.SEQUENCE)
    @Column(name = "vehi_id")
    private Integer id;
    @Column(name = "vehi_placa", unique = true)
    private String placa;
    @Column(name = "vehi_marca")
    private String marca;
    @Column(name = "vehi_fecha_fabricacion")
    private String fechaFabricacion;
    @Column(name = "vehi_color")
    private String color;
    @Column(name = "vehi_costo")
    private Integer costo;
    @Column(name = "vehi_activo")
    private Boolean activo;
    @Column(name = "vehi_oculto")
    private Boolean oculto;
    @Column(name = "vehi_foto_url")
    private String fotoUrl;



}
