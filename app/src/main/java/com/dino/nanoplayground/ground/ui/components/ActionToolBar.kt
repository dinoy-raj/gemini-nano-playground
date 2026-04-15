package com.dino.nanoplayground.ground.ui.components

import android.content.ClipData
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.CopyAll
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.ClipEntry
import androidx.compose.ui.platform.LocalClipboard
import androidx.compose.ui.unit.dp
import com.dino.nanoplayground.core.bounceEffectShape
import kotlinx.coroutines.launch


@Composable
fun ActionToolBar(content: String, title: String) {

    val clipboardManager = LocalClipboard.current
    val scope = rememberCoroutineScope()

    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.Center
    )
    {

        Box(
            modifier = Modifier
                .bounceEffectShape(
                    scaleFactor = .9f,
                    initialShape = 36.dp,
                    pressedShape = 16.dp,
                    onClick = {
                        val clipData = ClipData.newPlainText(title, content)
                        scope.launch {
                            clipboardManager.setClipEntry(clipEntry = ClipEntry(clipData = clipData))
                        }
                    }
                )
                .background(color = MaterialTheme.colorScheme.surface.copy(alpha = .5f)),
            contentAlignment = Alignment.Center
        )
        {
            Icon(
                imageVector = Icons.Rounded.CopyAll,
                modifier = Modifier
                    .padding(24.dp)
                    .size(20.dp),
                contentDescription = "send icon",
                tint = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }

    }
}

