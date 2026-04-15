package com.dino.nanoplayground

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import com.dino.nanoplayground.core.getSharedTextContent
import com.dino.nanoplayground.ground.ui.NanoGroundScreen
import com.dino.nanoplayground.navigation.MainNavigation
import com.dino.nanoplayground.ui.theme.NanoPlaygroundTheme
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {

    private var intentPrompt: String = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        installSplashScreen()
        intentPrompt = intent.getSharedTextContent()

        setContent {
            NanoPlaygroundTheme {
                Scaffold() {
                    MainNavigation(intentPrompt = intentPrompt, modifier = Modifier.padding(it))
                }
            }
        }
    }
}
