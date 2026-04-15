package com.dino.nanoplayground.ground.ui.components

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.spring
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.ExperimentalMaterial3ExpressiveApi
import androidx.compose.material3.LoadingIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.snapshots.SnapshotStateList
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@OptIn(ExperimentalMaterial3ExpressiveApi::class)
@Composable
fun ChatContent(
    modifier: Modifier = Modifier,
    isInferencing: Boolean,
    response: SnapshotStateList<String>,
) {

    val chatBoxRadius by animateDpAsState(
        targetValue = if (isInferencing) 56.dp else 36.dp,
        animationSpec = spring(
            stiffness = Spring.StiffnessVeryLow
        )
    )

    Box(modifier = modifier)
    {
        Box(
            modifier = Modifier
                .padding(8.dp)
                .fillMaxSize()
                .background(
                    color = MaterialTheme.colorScheme.surfaceContainer,
                    shape = RoundedCornerShape(chatBoxRadius)
                ),
            contentAlignment = Alignment.Center
        )
        {
            AnimatedContent(
                modifier = Modifier.fillMaxSize(),
                targetState = isInferencing,
                transitionSpec = { fadeIn() togetherWith fadeOut() }) {
                when (it) {
                    true -> Box(
                        modifier = Modifier.size(150.dp),
                        contentAlignment = Alignment.Center
                    )
                    {
                        LoadingIndicator()
                    }

                    false -> {
                        if (response.isEmpty()) {
                            Box(
                                modifier = Modifier.fillMaxSize(),
                                contentAlignment = Alignment.Center
                            )
                            {
                                Text(".")
                            }
                        } else {
                            // TODO:  in future construct Response slider
                            ResponseItem(response[0])
                        }
                    }
                }
            }

            AnimatedVisibility(
                visible = response.isNotEmpty(),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 16.dp)
                    .align(Alignment.BottomCenter)
            )
            {
                ActionToolBar(
                    title = "Nano Response",
                    content = response[0]
                )
            }
        }
    }
}