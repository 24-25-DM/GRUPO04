package com.ec.edu.ucemap.util

import android.content.Context
import com.ec.edu.ucemap.model.MenuItem
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import java.io.IOException

class JsonUtil {
    fun loadMenuItemsFromJson(context: Context, fileName: String): List<MenuItem> {
        val jsonString: String
        try {
            jsonString = context.assets.open(fileName).bufferedReader().use { it.readText() }
        } catch (ioException: IOException) {
            ioException.printStackTrace()
            return emptyList()
        }

        val listType = object : TypeToken<List<MenuItem>>() {}.type
        return Gson().fromJson(jsonString, listType)
    }

    fun loadJsonFromAsset(context: Context?, fileName: String): List<MenuItem>? {
        // Verificar si el contexto es nulo
        if (context == null) {
            return null
        }

        val jsonString: String
        try {
            // Leer el archivo JSON desde assets
            jsonString = context.assets.open(fileName).bufferedReader().use { it.readText() }
        } catch (ioException: IOException) {
            ioException.printStackTrace()
            return null
        }

        // Convertir el JSON a una lista de objetos MenuItem
        val listType = object : TypeToken<List<MenuItem>>() {}.type
        return Gson().fromJson(jsonString, listType)
    }
}