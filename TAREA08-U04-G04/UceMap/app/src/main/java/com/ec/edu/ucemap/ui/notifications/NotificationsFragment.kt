package com.ec.edu.ucemap.ui.notifications

import android.content.pm.PackageManager
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.EditText
import android.widget.TextView
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

class NotificationsFragment : Fragment(), MenuAdapter.PermissionRequester {

    private lateinit var recyclerView: RecyclerView
    private lateinit var viewAdapter: MenuAdapter
    private lateinit var viewManager: RecyclerView.LayoutManager
    private lateinit var menuItems: List<MenuItem>
    private lateinit var filteredMenuItems: List<MenuItem>
    private lateinit var noResultsTextView: TextView

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val rootView = inflater.inflate(R.layout.fragment_notifications, container, false)

        viewManager = LinearLayoutManager(context)
        menuItems = JsonUtil().loadMenuItemsFromJson(requireContext(), "laboratorios.json")
        filteredMenuItems = menuItems

        // Pasar "this" (el fragmento) como PermissionRequester
        viewAdapter = MenuAdapter(
            filteredMenuItems,
            requireContext(),
            { menuItem: MenuItem ->
                findNavController().navigate(R.id.action_notificationsFragment_to_mapFragment)
            },
            this // Implementación de PermissionRequester
        )

        recyclerView = rootView.findViewById<RecyclerView>(R.id.recycler_view_notification).apply {
            setHasFixedSize(true)
            layoutManager = viewManager
            adapter = viewAdapter
        }

        noResultsTextView = rootView.findViewById(R.id.no_results_text_view_noti)
        val searchEditText = rootView.findViewById<EditText>(R.id.search_edit_text_noti)
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
        filteredMenuItems = menuItems.filter {
            Normalizer.normalize(it.titulo, Normalizer.Form.NFD).contains(text, ignoreCase = true)
        }
        viewAdapter.updateList(filteredMenuItems)
        noResultsTextView.visibility = if (filteredMenuItems.isEmpty()) View.VISIBLE else View.GONE
    }

    // Implementación de PermissionRequester
    override fun requestLocationPermission() {
        ActivityCompat.requestPermissions(
            requireActivity(),
            arrayOf(android.Manifest.permission.ACCESS_FINE_LOCATION),
            1
        )
    }

    // Manejar la respuesta de la solicitud de permisos
    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == 1 && grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            // Permiso concedido, notificar al adaptador para obtener la ubicación
            viewAdapter.getCurrentLocation()
        }
    }
}