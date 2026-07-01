package com.dino.nanoplayground.ground.ui.sections

import androidx.compose.animation.animateColor
import androidx.compose.animation.core.LinearOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.ExperimentalMaterial3ExpressiveApi
import androidx.compose.material3.MaterialShapes
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.toShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.dino.nanoplayground.R

@OptIn(ExperimentalMaterial3ExpressiveApi::class)
@Composable
fun FeatureUnAvailableScreen(
    message: String = stringResource(R.string.feature_unavailable_message)
) {

    val infiniteTransition = rememberInfiniteTransition(label = "placeholder")
    val color by infiniteTransition.animateColor(
        initialValue = MaterialTheme.colorScheme.onSurfaceVariant,
        targetValue = MaterialTheme.colorScheme.onSurface.copy(alpha = .1f),
        animationSpec = infiniteRepeatable(
            animation = tween(1000, easing = LinearOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "color"
    )

    Column(
        modifier = Modifier
            .background(color = MaterialTheme.colorScheme.background)
            .padding(24.dp)
            .fillMaxSize(),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    )
    {
        Box(
            modifier = Modifier
                .size(300.dp)
                .background(
                    color = MaterialTheme.colorScheme.onSurface,
                    shape = MaterialShapes.Boom.toShape()
                )
        )

        Spacer(Modifier.height(36.dp))

        Text(
            modifier = Modifier.padding(horizontal = 8.dp),
            text = message,
            fontSize = 14.sp,
            lineHeight = 28.sp,
            textAlign = TextAlign.Center,
            color = color
        )
    }
}

@Composable
@Preview
fun FeatureUnAvailableScreenPreview() {
    FeatureUnAvailableScreen()
}