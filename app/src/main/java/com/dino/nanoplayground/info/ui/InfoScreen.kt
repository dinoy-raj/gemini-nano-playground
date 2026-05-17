package com.dino.nanoplayground.info.ui

import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.dino.nanoplayground.info.ui.sections.SettingsFooterSection

@Composable
fun InfoScreen(modifier: Modifier = Modifier)
{
    Scaffold(
        modifier = modifier,
        topBar = {

        }
    )
    {
        LazyColumn(modifier = Modifier.padding(it).fillMaxSize()) {
            item {
                Spacer(Modifier.height(24.dp))
            }

            item {
                SettingsFooterSection()
            }

            item {
                Spacer(Modifier.height(48.dp))
            }
        }
    }
}