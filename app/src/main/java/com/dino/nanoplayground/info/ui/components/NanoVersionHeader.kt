package com.dino.nanoplayground.info.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.AutoAwesome
import androidx.compose.material3.ExperimentalMaterial3ExpressiveApi
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialShapes
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.toShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.layout
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.dino.nanoplayground.R
import com.dino.nanoplayground.core.bounceEffectRotation
import kotlin.math.max

@OptIn(ExperimentalMaterial3ExpressiveApi::class)
@Composable
fun NanoVersionHeader(version: String) {
    Box(
        modifier = Modifier
            .bounceEffectRotation(
                scaleFactor = .55f,
                onClick = {}
            )
            .background(
                color = MaterialTheme.colorScheme.onPrimary,
                shape = MaterialShapes.Cookie9Sided.toShape()
            ),
        contentAlignment = Alignment.Center
    )
    {
        Column(
            modifier = Modifier
                .padding(48.dp)
                .layout { measurable, constraints ->
                    val placeable = measurable.measure(constraints)
                    val side = max(placeable.width, placeable.height)
                    layout(side, side) {
                        placeable.placeRelative(
                            (side - placeable.width) / 2,
                            (side - placeable.height) / 2
                        )
                    }
                },
            verticalArrangement = Arrangement.spacedBy(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        )
        {
            Icon(
                imageVector = Icons.Rounded.AutoAwesome,
                modifier = Modifier
                    .size(36.dp),
                contentDescription = stringResource(R.string.send_icon_content_description),
                tint = MaterialTheme.colorScheme.primary
            )
            Text(
                text = "Gemini\n$version",
                color = MaterialTheme.colorScheme.primary,
                textAlign = TextAlign.Center,
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold
            )
        }
    }
}