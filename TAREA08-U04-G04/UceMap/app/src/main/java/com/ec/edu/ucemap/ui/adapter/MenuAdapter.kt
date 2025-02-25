package com.ec.edu.ucemap.ui.adapter

import android.Manifest
import android.app.AlertDialog
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.PackageManager
import android.nfc.Tag
import android.provider.Settings
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.ec.edu.ucemap.R
import com.ec.edu.ucemap.model.MenuItem
import com.google.android.gms.location.*
import com.google.gson.Gson
import java.io.File

class MenuAdapter(
    private var menuItems: List<MenuItem>,
    private val context: Context,
    private val onItemClick: (MenuItem) -> Unit,
    private val permissionRequester: PermissionRequester
) : RecyclerView.Adapter<MenuAdapter.MenuViewHolder>() {

    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private var currentLatitude: Double = Double.NaN
    private var currentLongitude: Double = Double.NaN

    private val locationReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            if (intent != null) {
                val latitude = intent.getDoubleExtra("latitude", Double.NaN)
                val longitude = intent.getDoubleExtra("longitude", Double.NaN)
                if (!latitude.isNaN() && !longitude.isNaN()) {
                    currentLatitude = latitude
                    currentLongitude = longitude
                } else {
                    // Solicitar una nueva actualización si la ubicación es inválida
                    //requestLocationUpdate()
                }
            }
        }
    }

    init {
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(context)
        //fusedLocationClient = LocationServices.getFusedLocationProviderClient(context)
        //getCurrentLocation()

        // Registrar el BroadcastReceiver para actualizaciones de ubicación
        /*
        val filter = IntentFilter("com.ec.edu.ucemap.LOCATION_UPDATE")
        ContextCompat.registerReceiver(
            context,
            locationReceiver,
            filter,
            ContextCompat.RECEIVER_NOT_EXPORTED
        )
         */
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): MenuViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_menu, parent, false)
        return MenuViewHolder(view)
    }

    override fun onBindViewHolder(holder: MenuViewHolder, position: Int) {
        val menuItem = menuItems[position]
        holder.bind(menuItem)
    }

    override fun getItemCount() = menuItems.size

    inner class MenuViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val titleTextView: TextView = itemView.findViewById(R.id.titleTextView)
        private val imageView: ImageView = itemView.findViewById(R.id.imageView)

        fun bind(menuItem: MenuItem) {
            titleTextView.text = menuItem.titulo

            Glide.with(itemView.context)
                .load(menuItem.url_imagen)
                .into(imageView)
            itemView.setOnClickListener {
                if(checkLocationPermission() && isGpsEnabled()){
                    saveMenuItemToJson(menuItem)
                    Log.d("MenuAdapter", "Item clicked:"+menuItem.titulo)
                    onItemClick(menuItem)
                }else{
                    requestLocationPermissionsAndGps()
                }
            }
        }
        //verificar permisos
        private fun checkLocationPermission(): Boolean{
            return ActivityCompat.checkSelfPermission(
                context, Manifest.permission.ACCESS_FINE_LOCATION
            ) == PackageManager.PERMISSION_GRANTED
        }
        //verificar gps activado
        private fun isGpsEnabled(): Boolean{
            val locationManager = context.getSystemService(Context.LOCATION_SERVICE) as android.location.LocationManager
            return locationManager.isProviderEnabled(android.location.LocationManager.GPS_PROVIDER)
        }

        // Solicita permisos y GPS si no están habilitados
        private fun requestLocationPermissionsAndGps() {
            if (!checkLocationPermission()) {
                permissionRequester.requestLocationPermission()
                return
            }

            if (!isGpsEnabled()) {
                AlertDialog.Builder(context)
                    .setTitle("Activar GPS")
                    .setMessage("Es necesario activar el GPS para continuar. ¿Quieres encenderlo ahora?")
                    .setPositiveButton("Sí") { _, _ ->
                        val intent = Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS)
                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                        context.startActivity(intent)
                    }
                    .setNegativeButton("No") { dialog, _ ->
                        dialog.dismiss()
                    }
                    .show()
            }
        }

        private fun saveMenuItemToJson(menuItem: MenuItem) {
            val gson = Gson()
            val jsonString = gson.toJson(menuItem)
            val file = File(context.filesDir, "entidad_seleccionada.json")
            file.writeText(jsonString)

            Log.e("MenuAdapter", "Nombre de la entidad:  "+file)
        }
    }

    fun getCurrentLocation() {
        val locationManager = context.getSystemService(Context.LOCATION_SERVICE) as android.location.LocationManager
        val isGpsEnabled = locationManager.isProviderEnabled(android.location.LocationManager.GPS_PROVIDER)

        if (!isGpsEnabled) {
            // Mostrar alerta antes de abrir la configuración
            AlertDialog.Builder(context)
                .setTitle("Activar GPS")
                .setMessage("Es necesario activar el GPS para obtener tu ubicación. ¿Quieres encenderlo ahora?")
                .setPositiveButton("Sí") { _, _ ->
                    // Abrir configuración de ubicación
                    val intent = Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS)
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                    context.startActivity(intent)
                }
                .setNegativeButton("No") { dialog, _ ->
                    dialog.dismiss() // Cerrar el diálogo si el usuario no quiere activar el GPS
                }
                .show()
            return
        }

        if (ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            permissionRequester.requestLocationPermission()
            return
        }

        // Si el GPS está habilitado y los permisos están concedidos, obtener la ubicación
        fusedLocationClient.lastLocation.addOnSuccessListener { location ->
            if (location != null) {
                currentLatitude = location.latitude
                currentLongitude = location.longitude
            } else {
                // Si no hay una última ubicación conocida, solicitar actualizaciones en tiempo real
                //requestLocationUpdate()
            }
        }
    }


    private fun requestLocationUpdate() {
        if (ActivityCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
            val locationRequest = LocationRequest.Builder(LocationRequest.PRIORITY_HIGH_ACCURACY, 10000)
                .setWaitForAccurateLocation(false)
                .setMinUpdateIntervalMillis(5000)
                .setMaxUpdateDelayMillis(10000)
                .build()

            val locationCallback = object : LocationCallback() {
                override fun onLocationResult(locationResult: LocationResult) {
                    val lastLocation = locationResult.lastLocation
                    if (lastLocation != null) {
                        currentLatitude = lastLocation.latitude
                        currentLongitude = lastLocation.longitude
                    } else {
                        // Solicitar otra actualización si la ubicación sigue siendo nula
                        requestLocationUpdate()
                    }
                }
            }
            fusedLocationClient.requestLocationUpdates(locationRequest, locationCallback, null)
        } else {
            permissionRequester.requestLocationPermission()
        }
    }

    fun updateList(newMenuItems: List<MenuItem>) {
        menuItems = newMenuItems
        notifyDataSetChanged()
    }

    fun readMenuItemFromJson(): MenuItem? {
        val file = File(context.filesDir, "entidad_seleccionada.json")
        return if (file.exists()) {
            val jsonString = file.readText()
            Gson().fromJson(jsonString, MenuItem::class.java)
        } else {
            null
        }
    }

    interface PermissionRequester {
        fun requestLocationPermission()
    }
}