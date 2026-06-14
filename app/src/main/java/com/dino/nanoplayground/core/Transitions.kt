package com.dino.nanoplayground.core

import androidx.compose.animation.EnterTransition
import androidx.compose.animation.ExitTransition
import androidx.compose.animation.ExperimentalAnimationApi
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.spring
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.scaleIn
import androidx.compose.animation.scaleOut
import androidx.compose.animation.togetherWith

@OptIn(ExperimentalAnimationApi::class)
private fun scaleIntoContainer(
    popEnter: Boolean = false,
    initialScale: Float = if (popEnter) 0.9f else 1.1f
): EnterTransition {
    return scaleIn(
        animationSpec = spring(
            stiffness = Spring.StiffnessMediumLow
        ),
        initialScale = initialScale
    ) + fadeIn(
        animationSpec = spring(
            stiffness = Spring.StiffnessMediumLow
        ),
    )
}

@OptIn(ExperimentalAnimationApi::class)
private fun scaleOutOfContainer(
    exit: Boolean = false,
    targetScale: Float = if (exit) 0.9f else 1.1f
): ExitTransition {
    return scaleOut(
        animationSpec = spring(
            stiffness = Spring.StiffnessMediumLow
        ),
        targetScale = targetScale
    ) + fadeOut(
        animationSpec = spring(
            stiffness = Spring.StiffnessMediumLow
        ),
    )
}


object NanoTransitionSpecs {
    val default = scaleIntoContainer(popEnter = true)  togetherWith scaleOutOfContainer()
}