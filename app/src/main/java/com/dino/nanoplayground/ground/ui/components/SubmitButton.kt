package com.dino.nanoplayground.ground.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.AutoAwesome
import androidx.compose.material3.ExperimentalMaterial3ExpressiveApi
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialShapes
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.toShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.dino.nanoplayground.core.bounceEffectRotation


@OptIn(ExperimentalMaterial3ExpressiveApi::class)
@Composable
fun SubmitButton(
    modifier: Modifier = Modifier,
    isActive: Boolean = true,
    size: Dp,
    onClick: () -> Unit
) {
    Box(
        modifier = modifier
            .bounceEffectRotation {
                onClick()
            }
            .padding(8.dp)
            .size(size)
            .background(
                color = if (isActive) MaterialTheme.colorScheme.onSurface else MaterialTheme.colorScheme.onSurfaceVariant,
                shape = MaterialShapes.VerySunny.toShape()
            ),
        contentAlignment = Alignment.Center
    )
    {
        Icon(
            imageVector = Icons.Rounded.AutoAwesome,
            modifier = Modifier.size(size / 3),
            contentDescription = "send icon",
            tint = MaterialTheme.colorScheme.surface
        )
    }
}

@Preview(showBackground = true)
@Composable
fun SubmitButtonPreview() {
    SubmitButton(isActive = true, size = 50.dp)
    {

    }
}