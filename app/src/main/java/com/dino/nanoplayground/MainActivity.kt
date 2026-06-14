package com.dino.nanoplayground

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.DisposableEffect
import androidx.compose.ui.Modifier
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.lifecycle.compose.LocalLifecycleOwner
import com.dino.nanoplayground.core.getSharedTextContent
import com.dino.nanoplayground.navigation.MainNavigation
import com.dino.nanoplayground.ui.theme.NanoPlaygroundTheme
import com.google.android.play.core.appupdate.AppUpdateManager
import com.google.android.play.core.appupdate.AppUpdateManagerFactory
import com.google.android.play.core.appupdate.AppUpdateOptions
import com.google.android.play.core.install.model.AppUpdateType
import com.google.android.play.core.install.model.UpdateAvailability
import com.google.android.play.core.ktx.isImmediateUpdateAllowed
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {

    private var intentPrompt: String = ""
    private lateinit var appUpdateManager: AppUpdateManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        installSplashScreen()
        intentPrompt = intent.getSharedTextContent()
        appUpdateManager = AppUpdateManagerFactory.create(applicationContext)


        setContent {
            val lifecycleOwner = LocalLifecycleOwner.current

            DisposableEffect(lifecycleOwner) {
                val observer = LifecycleEventObserver { _, event ->
                    when (event) {
                        Lifecycle.Event.ON_RESUME -> {
                            appUpdateManager.appUpdateInfo.addOnSuccessListener { info ->
                                if (info.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE && info.isImmediateUpdateAllowed) {
                                    appUpdateManager.startUpdateFlow(
                                        info,
                                        this@MainActivity,
                                        AppUpdateOptions.newBuilder(AppUpdateType.IMMEDIATE)
                                            .build(),
                                    )
                                }
                            }
                        }

                        else -> {}
                    }
                }
                lifecycleOwner.lifecycle.addObserver(observer)
                onDispose {
                    lifecycleOwner.lifecycle.removeObserver(observer)
                }
            }


            NanoPlaygroundTheme {
                Scaffold {
                    MainNavigation(intentPrompt = intentPrompt, modifier = Modifier.padding(it))
                }
            }
        }
    }
}
