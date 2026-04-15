package com.dino.nanoplayground.ground.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.ExperimentalMaterial3ExpressiveApi
import androidx.compose.runtime.Composable
import androidx.compose.runtime.snapshots.SnapshotStateList
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.dino.nanoplayground.navigation.Info

@OptIn(ExperimentalMaterial3ExpressiveApi::class)
@Composable
fun ResponseContent(
    modifier: Modifier = Modifier,
    isInferencing: Boolean,
    modelVersion: String,
    onNavigate: (Any) -> Unit,
    response: SnapshotStateList<String>,
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 8.dp)
            .padding(bottom = 8.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {

        HeaderInfoBar(
            modifier = Modifier.fillMaxWidth(),
            modelVersion = modelVersion,
            onClick = { onNavigate(Info) }
        )

        ResponseDisplayBox(
            isInferencing = isInferencing,
            response = response
        )

    }
}