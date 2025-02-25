package com.ec.edu.ucemap

import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.view.View
import com.google.android.material.bottomnavigation.BottomNavigationView
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.findNavController
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.setupActionBarWithNavController
import androidx.navigation.ui.setupWithNavController
import com.ec.edu.ucemap.databinding.ActivityMainBinding
import com.ec.edu.ucemap.service.LocationService

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)


        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)



        val navView: BottomNavigationView = binding.navView

        val navController = findNavController(R.id.nav_host_fragment_activity_main)
        // Pasando cada ID de menú como un conjunto de IDs porque cada
        // menú debe ser considerado como un destino de nivel superior.
        val appBarConfiguration = AppBarConfiguration(
            setOf(
                R.id.navigation_administracion, R.id.navigation_dashboard, R.id.navigation_notifications
            )
        )
        setupActionBarWithNavController(navController, appBarConfiguration)
        navView.setupWithNavController(navController)

        // Agregar un listener para cambiar la visibilidad del BottomNavigationView
        navController.addOnDestinationChangedListener { _, destination, _ ->
            if (destination.id == R.id.mapFragment) {
                // Ocultar BottomNavigationView cuando se navega al MapFragment
                navView.visibility = View.GONE
            } else {
                // Mostrar BottomNavigationView cuando se navega a otros fragmentos
                navView.visibility = View.VISIBLE
            }
        }
        /// Start the LocationService
        val serviceIntent = Intent(this, LocationService::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(serviceIntent)
        } else {
            startService(serviceIntent)
        }
    }

    override fun onSupportNavigateUp(): Boolean {
        val navController = findNavController(R.id.nav_host_fragment_activity_main)
        return navController.navigateUp() || super.onSupportNavigateUp()
    }
}