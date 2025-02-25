plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
}

android {
    namespace = "com.ec.edu.ucemap"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.ec.edu.ucemap"
        minSdk = 25
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
    kotlinOptions {
        jvmTarget = "11"
    }
    buildFeatures {
        viewBinding = true
    }
}

dependencies {

    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.appcompat)
    implementation(libs.material)
    implementation(libs.androidx.constraintlayout)
    implementation(libs.androidx.lifecycle.livedata.ktx)
    implementation(libs.androidx.lifecycle.viewmodel.ktx)
    implementation(libs.androidx.navigation.fragment.ktx)
    implementation(libs.androidx.navigation.ui.ktx)
    implementation(libs.play.services.location)
    implementation(libs.firebase.crashlytics.buildtools)
    implementation(libs.core.ktx)
    implementation(libs.play.services.maps)
    testImplementation(libs.junit)
    testImplementation("org.robolectric:robolectric:4.8")
    androidTestImplementation("com.google.code.gson:gson:2.8.9")
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
    implementation("com.github.bumptech.glide:glide:4.14.2")
    annotationProcessor("com.github.bumptech.glide:compiler:4.14.2")
    implementation("org.osmdroid:osmdroid-android:6.1.10")
    implementation(libs.google.gson)
    implementation("com.google.android.gms:play-services-location:21.0.1")
    implementation("com.squareup.okhttp3:okhttp:4.9.3")
    implementation("androidx.biometric:biometric:1.2.0-alpha04")
}
