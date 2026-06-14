package com.dino.nanoplayground.ground.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.AutoAwesome
import androidx.compose.material.icons.rounded.BugReport
import androidx.compose.material3.ExperimentalMaterial3ExpressiveApi
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialShapes
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.toShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.dino.nanoplayground.R
import com.dino.nanoplayground.core.bounceEffectShape

@OptIn(ExperimentalMaterial3ExpressiveApi::class)
@Composable
fun HeaderInfoBar(modifier: Modifier = Modifier, modelVersion: String, onClick: () -> Unit) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .bounceEffectShape(scaleFactor = .8f) {
                onClick()
            }
            .background(color = MaterialTheme.colorScheme.surfaceContainer)
            .padding(horizontal = 16.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically
    )
    {
        Box(
            modifier = Modifier
                .background(
                    color = MaterialTheme.colorScheme.onPrimary,
                    shape = MaterialShapes.Cookie6Sided.toShape()
                ),
            contentAlignment = Alignment.Center
        )
        {
            Icon(
                imageVector = Icons.Rounded.AutoAwesome,
                modifier = Modifier
                    .padding(12.dp)
                    .size(10.dp),
                contentDescription = stringResource(R.string.send_icon_content_description),
                tint = MaterialTheme.colorScheme.primary
            )
        }
        Spacer(Modifier.width(16.dp))

        Text(
            text = stringResource(R.string.gemini_model_version, modelVersion),
            color = MaterialTheme.colorScheme.secondary,
            fontSize = 12.sp
        )

        Box(modifier = Modifier.weight(4f), contentAlignment = Alignment.CenterEnd) {
            Box(
                modifier = Modifier
                    .background(
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        shape = MaterialShapes.Pill.toShape()
                    ),
                contentAlignment = Alignment.Center
            )
            {
                Icon(
                    imageVector = Icons.Rounded.BugReport,
                    modifier = Modifier
                        .padding(8.dp)
                        .size(12.dp),
                    contentDescription = stringResource(R.string.send_icon_content_description),
                    tint = MaterialTheme.colorScheme.surface
                )
            }
        }
    }
}