package com.dino.nanoplayground.ground.ui.components

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.spring
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.selection.SelectionContainer
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.LoadingIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.unit.dp
import androidx.core.view.HapticFeedbackConstantsCompat
import dev.jeziellago.compose.markdowntext.MarkdownText


@Composable
fun ResponseDisplayBox(
    modifier: Modifier = Modifier,
    isInferencing: Boolean,
    response: String,
) {

    val chatBoxRadius by animateDpAsState(
        targetValue = if (isInferencing) 56.dp else 36.dp,
        animationSpec = spring(
            stiffness = Spring.StiffnessVeryLow
        )
    )

    Box(
        modifier = modifier
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
                        ResponseItem(response)
                    }
                }
            }
        }

        androidx.compose.animation.AnimatedVisibility(
            visible = response.isNotEmpty(),
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 16.dp)
                .align(Alignment.BottomCenter)
        )
        {
            ActionToolBar(
                title = "Nano Response",
                content = response
            )
        }
    }
}

@Composable
fun ResponseItem(text: String) {
    val scrollState = rememberScrollState()
    val view = LocalView.current

    LaunchedEffect(text) {
        view.performHapticFeedback(HapticFeedbackConstantsCompat.SEGMENT_FREQUENT_TICK)
        scrollState.animateScrollTo(scrollState.maxValue)
    }

    Box(modifier = Modifier.fillMaxSize().padding(horizontal = 24.dp)) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(scrollState)
        ) {
            Spacer(Modifier.height(32.dp))

            SelectionContainer {
                MarkdownText(
                    text,
                    modifier = Modifier.padding(4.dp),
                    syntaxHighlightTextColor = MaterialTheme.colorScheme.primary,
                    syntaxHighlightColor = MaterialTheme.colorScheme.surfaceContainer
                )
            }

            Spacer(Modifier.height(150.dp))
        }

        // Top Gradient Overlay
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(32.dp)
                .background(
                    brush = Brush.verticalGradient(
                        colors = listOf(
                            MaterialTheme.colorScheme.surfaceContainer,
                            Color.Transparent
                        )
                    )
                )
                .align(Alignment.TopCenter)
        )

        // Bottom Gradient Overlay
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(100.dp)
                .background(
                    brush = Brush.verticalGradient(
                        colors = listOf(
                            Color.Transparent,
                            MaterialTheme.colorScheme.surfaceContainer.copy(alpha = 0.5f),
                            MaterialTheme.colorScheme.surfaceContainer
                        )
                    )
                )
                .align(Alignment.BottomCenter)
        )
    }
}
