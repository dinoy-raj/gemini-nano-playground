package com.dino.nanoplayground.core

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.expandVertically
import androidx.compose.animation.fadeIn
import androidx.compose.animation.slideOutVertically
import androidx.compose.animation.togetherWith
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

@Composable
fun AnimatedCounter(
    value: Char,
    color: Color,
    fontSize: Int = 40,
    fontWeight: FontWeight = FontWeight.Normal
) {
    AnimatedContent(
        targetState = value, label = "",
        transitionSpec = {
            expandVertically() + fadeIn() togetherWith slideOutVertically(targetOffsetY = { it })
        }
    ) {
        Text(
            text = it.toString(),
            color = color,
            fontSize = (fontSize).sp,
            fontWeight = fontWeight
        )
    }
}