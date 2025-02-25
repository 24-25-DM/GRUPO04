package com.ec.edu.ucemap.ui.splash

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.ec.edu.ucemap.R
import com.ec.edu.ucemap.ui.login.LoginActivity

class SplashActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Aquí puedes establecer un layout para la pantalla de splash si lo deseas
        setContentView(R.layout.activity_splash)

        // Simula un retraso para mostrar la pantalla de splash
        val splashScreenDuration = 2000L // 2 segundos
        window.decorView.postDelayed({
            val intent = Intent(this, LoginActivity::class.java)
            startActivity(intent)
            finish()
        }, splashScreenDuration)
    }
}