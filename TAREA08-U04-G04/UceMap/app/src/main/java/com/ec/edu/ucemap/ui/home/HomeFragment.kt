package com.ec.edu.ucemap.ui.home

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.provider.Settings
import android.text.Editable
import android.text.TextWatcher
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.app.ActivityCompat
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.ec.edu.ucemap.R
import com.ec.edu.ucemap.model.MenuItem
import com.ec.edu.ucemap.ui.adapter.MenuAdapter
import com.ec.edu.ucemap.util.JsonUtil
import java.text.Normalizer

class HomeFragment : Fragment(), MenuAdapter.PermissionRequester {

    private lateinit var recyclerView: RecyclerView
    private lateinit var viewAdapter: MenuAdapter
    private lateinit var viewManager: RecyclerView.LayoutManager
    private lateinit var menuItems: List<MenuItem>
    private lateinit var filteredMenuItems: List<MenuItem>
    private lateinit var noResultsTextView: TextView

    // Registro para manejar la respuesta de la solicitud de permisos
    private val requestPermissionLauncher =
        registerForActivityResult(ActivityResultContracts.RequestPermission()) { isGranted ->
            if (isGranted) {
                // Permiso concedido, notificar al adaptador para obtener la ubicación
                //sviewAdapter.getCurrentLocation()
            } else {
                // Permiso denegado
                if (ActivityCompat.shouldShowRequestPermissionRationale(
                        requireActivity(),
                        android.Manifest.permission.ACCESS_FINE_LOCATION
                    )
                ) {
                    // Mostrar explicación al usuario
                    showPermissionExplanationDialog()
                } else {
                    // Redirigir a la configuración de la aplicación
                    openAppSettings()
                }
            }
        }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val rootView = inflater.inflate(R.layout.fragment_home, container, false)

        viewManager = LinearLayoutManager(context)
        menuItems = JsonUtil().loadMenuItemsFromJson(requireContext(), "administracion.json")
        filteredMenuItems = menuItems

        // Pasar "this" (el fragmento) como PermissionRequester
        viewAdapter = MenuAdapter(
            filteredMenuItems,
            requireContext(),
            { menuItem: MenuItem ->
                findNavController().navigate(R.id.action_homeFragment_to_mapFragment)
            },
            this // Implementación de PermissionRequester
        )

        recyclerView = rootView.findViewById<RecyclerView>(R.id.recycler_view_home).apply {
            setHasFixedSize(true)
            layoutManager = viewManager
            adapter = viewAdapter
        }

        noResultsTextView = rootView.findViewById(R.id.no_results_text_view)
        val searchEditText = rootView.findViewById<EditText>(R.id.search_edit_text)
        searchEditText.addTextChangedListener(object : TextWatcher {
            override fun afterTextChanged(s: Editable?) {
                filter(s.toString())
            }

            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}

            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}
        })

        return rootView
    }

    private fun filter(text: String) {
        val normalizedText = normalize(text)
        filteredMenuItems = if (normalizedText.isEmpty()) {
            menuItems
        } else {
            menuItems.filter { normalize(it.titulo).contains(normalizedText, ignoreCase = true) }
        }
        viewAdapter.updateList(filteredMenuItems)
        noResultsTextView.visibility = if (filteredMenuItems.isEmpty()) View.VISIBLE else View.GONE
    }

    private fun normalize(text: String): String {
        return Normalizer.normalize(text, Normalizer.Form.NFD)
            .replace("\\p{InCombiningDiacriticalMarks}+".toRegex(), "")
    }

    // Implementación de PermissionRequester
    override fun requestLocationPermission() {
        if (ActivityCompat.shouldShowRequestPermissionRationale(
                requireActivity(),
                android.Manifest.permission.ACCESS_FINE_LOCATION
            )
        ) {
            // Mostrar explicación antes de solicitar el permiso
            showPermissionExplanationDialog()
        } else {
            // Solicitar el permiso directamente
            requestPermissionLauncher.launch(android.Manifest.permission.ACCESS_FINE_LOCATION)
        }
    }

    // Mostrar un diálogo explicando por qué se necesitan los permisos
    private fun showPermissionExplanationDialog() {
        Toast.makeText(
            requireContext(),
            "Se necesita acceso a la ubicación para mostrar tu posición en el mapa.",
            Toast.LENGTH_LONG
        ).show()

        // Solicitar el permiso después de mostrar la explicación
        requestPermissionLauncher.launch(android.Manifest.permission.ACCESS_FINE_LOCATION)
    }

    // Redirigir al usuario a la configuración de la aplicación
    private fun openAppSettings() {
        Toast.makeText(
            requireContext(),
            "Por favor, habilita los permisos de ubicación en la configuración de la aplicación.",
            Toast.LENGTH_LONG
        ).show()

        val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS)
        val uri = Uri.fromParts("package", requireContext().packageName, null)
        intent.data = uri
        startActivity(intent)
    }
}