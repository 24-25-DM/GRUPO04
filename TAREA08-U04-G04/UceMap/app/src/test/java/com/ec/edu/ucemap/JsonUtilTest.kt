package com.ec.edu.ucemap

import android.content.Context
import androidx.test.core.app.ApplicationProvider
import com.ec.edu.ucemap.model.MenuItem
import com.ec.edu.ucemap.util.JsonUtil
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Test
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config
import org.junit.runner.RunWith

@RunWith(RobolectricTestRunner::class)
@Config(manifest=Config.NONE, sdk = [28])
class JsonUtilTest {

    @Test
    fun testLoadJsonFromAsset() {
        val context = ApplicationProvider.getApplicationContext<Context>()
        val jsonUtil = JsonUtil()
        val menuItems: List<MenuItem>? = jsonUtil.loadJsonFromAsset(context, "administracion.json")

        assertNotNull(menuItems)
        assertEquals(2, menuItems?.size)
        assertEquals("Administración 1", menuItems?.get(0)?.titulo)
        assertEquals("Administración 2", menuItems?.get(1)?.titulo)
    }
}