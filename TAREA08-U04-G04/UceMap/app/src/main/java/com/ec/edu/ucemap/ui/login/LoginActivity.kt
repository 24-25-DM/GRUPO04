package com.ec.edu.ucemap.ui.login

import android.content.Intent
import android.os.Bundle
import android.provider.Settings
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import com.ec.edu.ucemap.MainActivity
import com.ec.edu.ucemap.databinding.ActivityLoginBinding

class LoginActivity : AppCompatActivity() {

    private lateinit var binding: ActivityLoginBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        checkBiometricSupport()

        binding.btnRetry.setOnClickListener {
            authenticateUser()
        }
    }

    private fun checkBiometricSupport() {
        val biometricManager = BiometricManager.from(this)
        when (biometricManager.canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_STRONG or BiometricManager.Authenticators.DEVICE_CREDENTIAL)) {
            BiometricManager.BIOMETRIC_SUCCESS -> {
                authenticateUser()
            }
            BiometricManager.BIOMETRIC_ERROR_NO_HARDWARE,
            BiometricManager.BIOMETRIC_ERROR_HW_UNAVAILABLE -> {
                showErrorMessage("El hardware biométrico no está disponible.")
            }
            BiometricManager.BIOMETRIC_ERROR_NONE_ENROLLED -> {
                showEnrollmentDialog()
            }

            BiometricManager.BIOMETRIC_ERROR_SECURITY_UPDATE_REQUIRED -> {
                showErrorMessage("Se requiere una actualización de seguridad.")
            }

            BiometricManager.BIOMETRIC_ERROR_UNSUPPORTED -> {
                showErrorMessage("El dispositivo no soporta la autenticación biométrica.")
            }

            BiometricManager.BIOMETRIC_STATUS_UNKNOWN -> {
                showErrorMessage("Estado desconocido.")
            }
        }
    }

    private fun authenticateUser() {
        val executor = ContextCompat.getMainExecutor(this)
        val biometricPrompt = BiometricPrompt(this, executor,
            object : BiometricPrompt.AuthenticationCallback() {
                override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                    super.onAuthenticationSucceeded(result)
                    navigateToMainActivity()
                }

                override fun onAuthenticationFailed() {
                    super.onAuthenticationFailed()
                    showErrorMessage("Authentication failed. Please try again.")
                }
            })

        val promptInfoBuilder = BiometricPrompt.PromptInfo.Builder()
            .setTitle("Biometric login for UCEMap")
            .setSubtitle("Log in using your biometric credential or device PIN/password")

        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.R) {
            promptInfoBuilder.setAllowedAuthenticators(BiometricManager.Authenticators.BIOMETRIC_STRONG or BiometricManager.Authenticators.DEVICE_CREDENTIAL)
        } else {
            promptInfoBuilder.setAllowedAuthenticators(BiometricManager.Authenticators.BIOMETRIC_WEAK or BiometricManager.Authenticators.DEVICE_CREDENTIAL)
        }

        val promptInfo = promptInfoBuilder.build()
        biometricPrompt.authenticate(promptInfo)
    }

    private fun showEnrollmentDialog() {
        Toast.makeText(this, "No hay credenciales biométricas registradas. Redirigiendo a los ajustes...", Toast.LENGTH_LONG).show()
        AlertDialog.Builder(this)
            .setTitle("Autenticación biométrica")
            .setMessage("No hay credenciales biométricas registradas. Por favor, configura la autenticación biométrica en los ajustes de tu dispositivo.")
            .setPositiveButton("Ajustes") { _, _ ->
                val intent = if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.R) {
                    Intent(Settings.ACTION_BIOMETRIC_ENROLL)
                } else {
                    Intent(Settings.ACTION_SECURITY_SETTINGS)
                }
                startActivity(intent)
            }

            .setNegativeButton("Cancelar") { dialog, _ ->
                dialog.dismiss()
            }
            .show()
    }

    private fun navigateToMainActivity() {
        val intent = Intent(this, MainActivity::class.java)
        startActivity(intent)
        finish()
    }

    private fun showErrorMessage(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }
}