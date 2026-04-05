package com.dino.nanoplayground.ground.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.text.selection.SelectionContainer
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import dev.jeziellago.compose.markdowntext.MarkdownText


// TODO : Implement response slider in future

@Composable
fun ResponseItem(text: String) {

    Box(modifier = Modifier.padding(24.dp))
    {
        LazyColumn() {

            item {
                Spacer(Modifier.height(16.dp))
            }

            item {
                SelectionContainer {
                    MarkdownText(
                        text,
                        modifier = Modifier.padding(4.dp),
                        syntaxHighlightTextColor = MaterialTheme.colorScheme.primary,
                        syntaxHighlightColor =  MaterialTheme.colorScheme.surfaceContainer
                    )
                }
            }

            item {
                Spacer(Modifier.height(24.dp))
            }
        }

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(24.dp)
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
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(48.dp)
                .background(
                    brush = Brush.verticalGradient(
                        colors = listOf(
                            Color.Transparent,
                            MaterialTheme.colorScheme.surfaceContainer.copy(alpha = .2f),
                            MaterialTheme.colorScheme.surfaceContainer.copy(alpha = .5f),
                            MaterialTheme.colorScheme.surfaceContainer.copy(alpha = .7f),
                            MaterialTheme.colorScheme.surfaceContainer
                        )
                    )
                )
                .align(Alignment.BottomCenter)
        )
    }

}