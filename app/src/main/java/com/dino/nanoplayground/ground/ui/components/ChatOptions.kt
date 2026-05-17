package com.dino.nanoplayground.ground.ui.components

import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.AutoAwesomeMotion
import androidx.compose.material.icons.rounded.CleaningServices
import androidx.compose.material.icons.rounded.Gesture
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.ExperimentalMaterial3ExpressiveApi
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialShapes
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.toShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.res.stringResource
import com.dino.nanoplayground.R
import com.dino.nanoplayground.core.AnimatedCounter
import com.dino.nanoplayground.core.bounceEffectRotation
import com.dino.nanoplayground.core.bounceEffectShape
import com.dino.nanoplayground.navigation.Settings


@OptIn(ExperimentalMaterial3ExpressiveApi::class)
@Composable
fun ChatOptions(
    modifier: Modifier = Modifier,
    countDown: Int,
    isInferencing: Boolean,
    onNavigate: (Any) -> Unit,
    onCacheClear: () -> Unit
) {


    val rotation by animateFloatAsState(
        targetValue = if (countDown % 2 == 0) 0f else 450f,
        animationSpec = tween(durationMillis = 1000, easing = FastOutSlowInEasing)
    )
    var showClearCacheDialog by remember { mutableStateOf(false) }




    if (showClearCacheDialog) {
        AlertDialog(
            onDismissRequest = {
                showClearCacheDialog = false
            },
            icon = {
                Icon(Icons.Rounded.AutoAwesomeMotion, contentDescription = null)
            },
            title = {
                Text(text = stringResource(R.string.clear_cache_title))
            },
            text = {
                Text(
                    text = stringResource(R.string.clear_cache_message)
                )
            },
            confirmButton = {
                TextButton(
                    onClick = {
                        onCacheClear()
                        showClearCacheDialog = false
                    }
                ) {
                    Text(stringResource(R.string.clear))
                }
            },
            dismissButton = {
                TextButton(
                    onClick = {
                        showClearCacheDialog = false
                    }
                ) {
                    Text(stringResource(R.string.cancel))
                }
            }
        )
    }



    Box(modifier = modifier)
    {

        Row(
            modifier = Modifier.fillMaxSize(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(4.dp)
        )
        {

            Box(
                modifier = Modifier
                    .padding(8.dp)
                    .fillMaxHeight()
                    .bounceEffectRotation()
                    {},
                contentAlignment = Alignment.Center
            )
            {
                Box(
                    modifier = Modifier
                        .rotate(rotation)
                        .fillMaxHeight()
                        .width(90.dp)
                        .background(
                            color = MaterialTheme.colorScheme.surfaceContainerHigh,
                            shape = MaterialShapes.Cookie4Sided.toShape()
                        ),
                )

                Row(
                    horizontalArrangement = Arrangement.Absolute.Center,
                    verticalAlignment = Alignment.CenterVertically
                )
                {
                    countDown.toString().forEach {
                        AnimatedCounter(
                            value = it,
                            color = if (isInferencing) MaterialTheme.colorScheme.onSurface else MaterialTheme.colorScheme.onSurfaceVariant,
                            fontSize = 13,
                            fontWeight = if (isInferencing) FontWeight.Bold else FontWeight.Normal
                        )
                    }

                    Text(
                        text = stringResource(R.string.seconds_suffix),
                        fontSize = 8.sp,
                        color = if (isInferencing) MaterialTheme.colorScheme.onSurface else MaterialTheme.colorScheme.onSurfaceVariant,
                        fontWeight = if (isInferencing) FontWeight.Bold else FontWeight.Normal
                    )
                }
            }

            Box(
                modifier = Modifier
                    .padding(8.dp)
                    .fillMaxHeight()
                    .weight(1f)
                    .bounceEffectShape(initialShape = 24.dp, pressedShape = 80.dp)
                    {
                        onNavigate(Settings)
                    }
            )
            {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(
                            color = MaterialTheme.colorScheme.surfaceContainerHigh,
                            shape = RoundedCornerShape(24.dp)
                        ),
                    contentAlignment = Alignment.Center
                )
                {
                    Icon(
                        imageVector = Icons.Rounded.Gesture,
                        modifier = Modifier.size(20.dp),
                        contentDescription = stringResource(R.string.send_icon_content_description),
                        tint = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            Box(
                modifier = Modifier
                    .padding(8.dp)
                    .fillMaxHeight()
                    .bounceEffectRotation()
                    {
                        showClearCacheDialog = true
                    }
            )
            {
                Box(
                    modifier = Modifier
                        .fillMaxHeight()
                        .width(90.dp)
                        .background(
                            color = MaterialTheme.colorScheme.surfaceContainerHigh,
                            shape = MaterialShapes.Ghostish.toShape()
                        ),
                    contentAlignment = Alignment.Center
                )
                {
                    Icon(
                        imageVector = Icons.Rounded.CleaningServices,
                        modifier = Modifier.size(20.dp),
                        contentDescription = stringResource(R.string.send_icon_content_description),
                        tint = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }
    }
}