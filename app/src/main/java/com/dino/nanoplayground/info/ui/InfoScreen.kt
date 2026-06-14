package com.dino.nanoplayground.info.ui

import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.dino.nanoplayground.info.ui.components.NanoVersionHeader
import com.dino.nanoplayground.info.ui.sections.InfoFooterSection

@Composable
fun InfoScreen(modifier: Modifier = Modifier, nanoVersion: String, tokenLimit: String) {
    Scaffold(
        modifier = modifier,
        topBar = {

        }
    )
    {
        LazyColumn(
            modifier = Modifier
                .padding(it)
                .fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            item {
                Spacer(Modifier.height(24.dp))
            }

            item {
                NanoVersionHeader(version = nanoVersion)
            }

            item {
                Spacer(Modifier.height(24.dp))
            }

            item {
                InfoFooterSection()
            }

            item {
                Spacer(Modifier.height(48.dp))
            }
        }
    }
}