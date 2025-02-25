package com.ec.edu.ucemap.model

data class MenuItem(
    val id: Int,
    val titulo: String,
    val url_imagen: String,
    val descripcion: String,
    val longitud: Double,
    val latitud: Double
)