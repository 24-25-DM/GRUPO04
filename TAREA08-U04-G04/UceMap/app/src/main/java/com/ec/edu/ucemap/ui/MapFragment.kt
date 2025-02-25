package com.ec.edu.ucemap.ui

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.location.Location
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.ImageView
import android.widget.TextView
import androidx.core.app.ActivityCompat
import androidx.drawerlayout.widget.DrawerLayout
import androidx.fragment.app.Fragment
import com.bumptech.glide.Glide
import com.ec.edu.ucemap.R
import com.ec.edu.ucemap.model.MenuItem
import com.ec.edu.ucemap.service.LocationService
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.GoogleMap
import com.google.android.gms.maps.OnMapReadyCallback
import com.google.android.gms.maps.SupportMapFragment
import com.google.android.gms.maps.model.BitmapDescriptorFactory
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.maps.model.Marker
import com.google.android.gms.maps.model.MarkerOptions
import com.google.android.gms.maps.model.PolylineOptions
import com.google.android.material.navigation.NavigationView
import com.google.gson.Gson
import java.io.File
import com.google.android.gms.maps.model.Polyline
import org.json.JSONObject

class MapFragment : Fragment(), OnMapReadyCallback {

    private lateinit var googleMap: GoogleMap
    private lateinit var drawerLayout: DrawerLayout
    private lateinit var navigationView: NavigationView
    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private var isRouteDrawn = false
    private var isRoutesDrawn = false

    private var polylineRute: Polyline? = null
    private var polylineRuteDiagonal: Polyline? = null
    private val polylineRutesOtherList = mutableListOf<Polyline>()
    // Variables estáticas para almacenar la latitud y longitud de los puntos de inicio y fin
    companion object {
        var startLatitude: Double = Double.NaN
        var startLongitude: Double = Double.NaN
        var endLatitude: Double = Double.NaN
        var endLongitude: Double = Double.NaN
        var userGPS: LatLng = LatLng(0.0, 0.0)
    }

    // Lista de puntos de LatLng que se inicializa con la ubicación actual y el punto de la entidad seleccionada
    private val points: MutableList<LatLng> = mutableListOf()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        // Inflar el layout del fragmento
        return inflater.inflate(R.layout.fragment_map, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(requireContext())

        // Inicializar DrawerLayout y NavigationView
        drawerLayout = view.findViewById(R.id.drawer_layout)
        navigationView = view.findViewById(R.id.navigation_view)


        // Inicializar Google Map
        val mapFragment = childFragmentManager.findFragmentById(R.id.map) as SupportMapFragment
        mapFragment.getMapAsync(this)

        // Configurar el botón para abrir el drawer
        val showDrawerButton: Button = view.findViewById(R.id.show_drawer_button)
        showDrawerButton.setOnClickListener {
            drawerLayout.openDrawer(navigationView)
            updateDrawerHeader()
        }
        //Agregar botones interactivos
        val showRuteButton: Button = view.findViewById(R.id.idMejor)
        val showOtherRutesButton: Button = view.findViewById(R.id.idOtros)
        //funcionalidad de los botones
        showRuteButton.setOnClickListener {
            if (isRouteDrawn) {
                polylineRute?.remove()
                isRouteDrawn = false
            } else {
                mejorRuta()
                isRouteDrawn = true
            }
        }
        showOtherRutesButton.setOnClickListener {
            if (isRoutesDrawn) {
                removeRuteOthers()
                polylineRuteDiagonal?.remove()
                isRoutesDrawn = false
            } else {
                //dibujar la ruta del JSON
                rutaExtemoExtremo();
                ruteOthers()
                isRoutesDrawn = true
            }
        }

        // Iniciar el servicio de ubicación
        val locationServiceIntent = Intent(requireContext(), LocationService::class.java)
        requireContext().startService(locationServiceIntent)

        // Registrar el BroadcastReceiver para recibir actualizaciones de ubicación
        /*
        val filter = IntentFilter("com.ec.edu.ucemap.LOCATION_UPDATE")
        ContextCompat.registerReceiver(
            requireContext(),
            locationReceiver,
            filter,
            ContextCompat.RECEIVER_NOT_EXPORTED
        )

         */

        // Cargar los puntos iniciales
        loadInitialPoints()
        getLocationUser()
    }

    override fun onMapReady(map: GoogleMap) {
        googleMap = map
        googleMap.setMapType(GoogleMap.MAP_TYPE_SATELLITE)
        googleMap.uiSettings.isZoomGesturesEnabled = true
        // Habilitar controles de zoom
        googleMap.uiSettings.isZoomControlsEnabled = true
        // Verificar permisos y obtener ubicación
        if (ActivityCompat.checkSelfPermission(
                requireContext(),
                Manifest.permission.ACCESS_FINE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            requestPermissions(arrayOf(Manifest.permission.ACCESS_FINE_LOCATION), 1)
            return
        }

        // Actualizar el mapa con los puntos cargados
        googleMap.isMyLocationEnabled = true
        getLocationUser()
        updateMap()
    }

    /// Referencia del destino
    private fun updateMap() {
        if (points.isNotEmpty()) {
            val startPoint = points[0]
            googleMap.moveCamera(CameraUpdateFactory.newLatLngZoom(startPoint, 15f))

            // Limpiar marcadores anteriores
            googleMap.clear()

            // Agregar marcadores al mapa
            for (point in points) {
                googleMap.addMarker(MarkerOptions()
                    .position(point)
                    .title("Destino Seleccionado")
                    .icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_GREEN))
                )
            }
        }
    }

    private fun loadInitialPoints() {
        // Leer el punto de la entidad seleccionada
        val file = File(requireContext().filesDir, "entidad_seleccionada.json")
        if (file.exists()) {
            val jsonString = file.readText()
            val menuItem = Gson().fromJson(jsonString, MenuItem::class.java)
            startLatitude = menuItem.latitud
            startLongitude = menuItem.longitud
            val destination = LatLng(startLatitude, startLongitude)
            points.add(destination)
        }
    }

    private fun updateDrawerHeader() {
        val file = File(requireContext().filesDir, "entidad_seleccionada.json")
        if (file.exists()) {
            val jsonString = file.readText()
            val menuItem = Gson().fromJson(jsonString, MenuItem::class.java)

            val headerView = navigationView.getHeaderView(0)
            val drawerImage: ImageView = headerView.findViewById(R.id.drawer_image)
            val drawerTitle: TextView = headerView.findViewById(R.id.drawer_title)
            val drawerDescription: TextView = headerView.findViewById(R.id.drawer_description)

            drawerTitle.text = menuItem.titulo
            drawerDescription.text = menuItem.descripcion
            Glide.with(this).load(menuItem.url_imagen).into(drawerImage)
        }
    }


    override fun onDestroy() {
        super.onDestroy()
        // Desregistrar el BroadcastReceiver
        //requireContext().unregisterReceiver(locationReceiver)
        val locationServiceIntent = Intent(requireContext(), LocationService::class.java)
        requireContext().stopService(locationServiceIntent)
    }

    private fun mejorRuta() {
        val file = File(requireContext().filesDir, "entidad_seleccionada.json")
        var tituloM = ""
        if (file.exists()) {
            val jsonString = file.readText()
            val menuItem = Gson().fromJson(jsonString, MenuItem::class.java)
            Log.e("MapFragment", menuItem.titulo)
            tituloM = menuItem.titulo

        } else {
            Log.e("MapFragment", "El archivo entidad seleccionada no de rutas no existe.")
        }
        var tituloR = tituloM + "_rutas.json"
        Log.e("MapFragment", tituloR)
        try {
            val inputStream = requireContext().assets.open(tituloR)
            val jsonString = inputStream.bufferedReader().use { it.readText() }
            inputStream.close()

            val jsonObject = JSONObject(jsonString)
            val mejorCamino = jsonObject.getJSONArray("mejor_camino")
            val polylineOptions = PolylineOptions().color(0xFF00FF00.toInt()).width(10f)

            for (i in 0 until mejorCamino.length()) {
                val punto = mejorCamino.getJSONObject(i)
                val lat = punto.getDouble("latitude")
                val lng = punto.getDouble("longitude")
                polylineOptions.add(LatLng(lat, lng))
            }

            //googleMap.clear()
            polylineRute = googleMap.addPolyline(polylineOptions)

        } catch (e: Exception) {
            Log.e("MapFragment", "Error al cargar la ruta desde assets", e)
        }


    }

    private fun ruteOthers() {
        val file = File(requireContext().filesDir, "entidad_seleccionada.json")
        var tituloM = ""

        if (file.exists()) {
            val jsonString = file.readText()
            val menuItem = Gson().fromJson(jsonString, MenuItem::class.java)
            Log.e("MapFragment", menuItem.titulo)
            tituloM = menuItem.titulo
        } else {
            Log.e("MapFragment", "El archivo entidad seleccionada no de rutas no existe.")
            return
        }

        var tituloR = tituloM + "_rutas.json"
        Log.e("MapFragment", tituloR)
        try {
            val inputStream = requireContext().assets.open(tituloR)
            val jsonString = inputStream.bufferedReader().use { it.readText() }
            inputStream.close()

            val jsonObject = JSONObject(jsonString)

            // Definir colores para cada ruta
            val colores = listOf(
                0xFF0000FF.toInt(),
                0xFF0000FF.toInt(),
                0xFF00FFFF.toInt(),
                0xFFFF00FF.toInt(),
                0xFF000000.toInt(),
                0xFFFFFFFF.toInt()
            )
            /// ORDEN COLORES : AZUL - ROJO - VERDE - MAGENTA - NEGRO - BLANCO

            var colorIndex = 0

            jsonObject.keys().forEach { key ->
                val caminoArray = jsonObject.getJSONArray(key)
                val polylineOptions =
                    PolylineOptions()
                        .color(colores[colorIndex % colores.size])
                        .width(10f)

                for (i in 0 until caminoArray.length()) {
                    val punto = caminoArray.getJSONObject(i)
                    val lat = punto.getDouble("latitude")
                    val lng = punto.getDouble("longitude")
                    polylineOptions.add(LatLng(lat, lng))
                }

                // Agregar la ruta al mapa
                //polylineRutesOther = googleMap.addPolyline(polylineOptions)
                val polyline = googleMap.addPolyline(polylineOptions)
                polyline.tag = key // Guardar el nombre de la ruta como etiqueta
                polylineRutesOtherList.add(polyline)


                // Mover la cámara al inicio de la ruta
                /*
                if (polylineOptions.points.isNotEmpty()) {
                    googleMap.moveCamera(CameraUpdateFactory.newLatLngZoom(polylineOptions.points[0], 15f))
                }

                 */
                colorIndex++ // Cambiar color para la siguiente ruta
            }

        } catch (e: Exception) {
            Log.e("MapFragment", "Error al cargar la ruta desde assets", e)
        }
    }

    // eliminar las rutas del arrelgo
    private fun removeRuteOthers() {
        polylineRutesOtherList.forEach { it.remove() }
        polylineRutesOtherList.clear() // Limpiar la lista
    }

    override fun onStop() {
        super.onStop()
        val locationServiceIntent = Intent(requireContext(), LocationService::class.java)
        requireContext().stopService(locationServiceIntent)
    }

    private fun getLocationUser() {
        if (ActivityCompat.checkSelfPermission(
                requireContext(),
                Manifest.permission.ACCESS_FINE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            return
        }

        fusedLocationClient.lastLocation.addOnSuccessListener { location: Location? ->

            if (location != null) {
                var userLatLng = LatLng(location.latitude, location.longitude)
                userGPS = LatLng(location.latitude, location.longitude)

                // Agregar marcador en la ubicación actual
                googleMap.addMarker(MarkerOptions()
                    .position(userLatLng)
                    .title("Mi Ubicación")
                    .icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_AZURE)))

                // Mover la cámara al usuario
                googleMap.animateCamera(CameraUpdateFactory.newLatLngZoom(userLatLng, 15f))

                googleMap.moveCamera(CameraUpdateFactory.newLatLngZoom(userLatLng, 15f))
            }
        }
    }

    /// Mejor camino directo osea la diagonal
    private fun rutaExtemoExtremo() {
        val startLatLng = userGPS
        val endLatLng = LatLng(startLatitude, startLongitude)
        val points: MutableList<LatLng> = mutableListOf()
        points.add(startLatLng)
        points.add(endLatLng)
        val polylineOptions = PolylineOptions().color(0xFFFFFF00.toInt()).width(10f)
        for (point in points) {
            polylineOptions.add(point)
        }
        polylineRuteDiagonal = googleMap.addPolyline(polylineOptions)
    }
}