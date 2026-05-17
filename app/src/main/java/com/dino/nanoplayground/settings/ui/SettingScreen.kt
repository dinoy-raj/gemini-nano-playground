package com.dino.nanoplayground.settings.ui

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier

import androidx.compose.ui.res.stringResource
import com.dino.nanoplayground.R

@Composable
fun SettingScreen() {
    Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center)
    {
        Text(stringResource(R.string.nothing_here))
    }
}