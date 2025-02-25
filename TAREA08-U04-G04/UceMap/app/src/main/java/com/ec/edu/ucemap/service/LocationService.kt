package com.ec.edu.ucemap.service

import android.Manifest
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.content.pm.PackageManager
import android.location.Location
import android.os.Build
import android.os.IBinder
import androidx.core.app.ActivityCompat
import androidx.core.app.NotificationCompat
import com.google.android.gms.location.*

class LocationService : Service() {

    // Cliente para obtener la ubicación
    private lateinit var fusedLocationClient: FusedLocationProviderClient
    // Callback para recibir actualizaciones de ubicación
    private lateinit var locationCallback: LocationCallback
    // Lista para almacenar las ubicaciones recibidas
    private val locationList = mutableListOf<Location>()

    override fun onCreate() {
        super.onCreate()
        // Inicializar el cliente de ubicación
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)
        // Definir el callback para manejar las actualizaciones de ubicación
        locationCallback = object : LocationCallback() {
            override fun onLocationResult(locationResult: LocationResult) {
                val location = locationResult.lastLocation
                if (location != null) {
                    // Agregar la ubicación a la lista
                    locationList.add(location)
                    // Si se han recibido al menos 3 ubicaciones
                    if (locationList.size >= 3) {
                        // Verificar si las tres ubicaciones son distintas
                        val allDifferent = locationList.distinctBy { it.latitude to it.longitude }.size == 3
                        val locationToSend = if (allDifferent) locationList.last() else locationList.first()
                        // Enviar la ubicación válida mediante un Broadcast
                        val intent = Intent("com.ec.edu.ucemap.LOCATION_UPDATE")
                        intent.putExtra("latitude", locationToSend.latitude)
                        intent.putExtra("longitude", locationToSend.longitude)
                        sendBroadcast(intent)
                        // Limpiar la lista de ubicaciones
                        locationList.clear()
                    }
                }
            }
        }
        // Iniciar las actualizaciones de ubicación
        startLocationUpdates()
    }

    private fun startLocationUpdates() {
        // Configurar la solicitud de ubicación con un intervalo de actualización más largo
        val locationRequest = LocationRequest.Builder(LocationRequest.PRIORITY_HIGH_ACCURACY, 30000)
            .setWaitForAccurateLocation(false)
            .setMinUpdateIntervalMillis(1000)
            .setMaxUpdateDelayMillis(3000)
            .build()

        // Verificar permisos y solicitar actualizaciones de ubicación
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
            fusedLocationClient.requestLocationUpdates(locationRequest, locationCallback, null)
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // Crear el canal de notificación
        createNotificationChannel()
        // Crear la notificación para el servicio en primer plano
        val notification: Notification = NotificationCompat.Builder(this, "LocationServiceChannel")
            .setContentTitle("Location Service")
            .setContentText("Tracking location in background")
            .setSmallIcon(android.R.drawable.ic_menu_mylocation)
            .build()
        // Iniciar el servicio en primer plano
        startForeground(1, notification)
        return START_NOT_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()
        // Detener las actualizaciones de ubicación
        fusedLocationClient.removeLocationUpdates(locationCallback)
    }

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    private fun createNotificationChannel() {
        // Crear el canal de notificación si la versión de Android es Oreo o superior
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val serviceChannel = NotificationChannel(
                "LocationServiceChannel",
                "Location Service Channel",
                NotificationManager.IMPORTANCE_DEFAULT
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(serviceChannel)
        }
    }
}