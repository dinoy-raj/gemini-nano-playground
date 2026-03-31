package com.dino.nanoplayground.core

import android.view.MotionEvent
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.ExperimentalComposeUiApi
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.scale
import androidx.compose.ui.input.pointer.pointerInteropFilter
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.core.view.HapticFeedbackConstantsCompat


@OptIn(ExperimentalComposeUiApi::class)
@Composable
fun Modifier.bounceEffect(
    scaleFactor: Float = .95f,
    intercept: Boolean = true,
    onClick: () -> Unit
): Modifier {

    var pointerState by remember { mutableIntStateOf(MotionEvent.ACTION_UP) }
    val view = LocalView.current

    val scale by animateFloatAsState(
        label = "scaling content",
        targetValue = if (pointerState == MotionEvent.ACTION_DOWN) {
            scaleFactor
        } else 1f,
        animationSpec = spring(
            stiffness = Spring.StiffnessMedium
        )
    )
    return this then Modifier
        .scale(scale)
        .pointerInteropFilter {
            when (it.action) {

                MotionEvent.ACTION_DOWN -> {
                    if (intercept) {
                        pointerState = MotionEvent.ACTION_DOWN
                    }
                }

                MotionEvent.ACTION_UP -> {
                    if (intercept) {
                        pointerState = MotionEvent.ACTION_UP
                        view.performHapticFeedback(HapticFeedbackConstantsCompat.LONG_PRESS)
                        onClick()
                    }
                }

                MotionEvent.ACTION_CANCEL -> pointerState = MotionEvent.ACTION_UP
            }
            intercept
        }
}


@OptIn(ExperimentalComposeUiApi::class)
@Composable
fun Modifier.bounceEffectShape(
    scaleFactor: Float = .6f,
    initialShape: Dp = 100.dp,
    pressedShape: Dp = 10.dp,
    onClick: () -> Unit
): Modifier {

    val view = LocalView.current
    var pointerState by remember { mutableIntStateOf(MotionEvent.ACTION_UP) }

    val radius by animateDpAsState(
        label = "scaling content",
        targetValue = if (pointerState == MotionEvent.ACTION_DOWN) pressedShape else initialShape,
        animationSpec = spring(
            stiffness = Spring.StiffnessMediumLow
        )
    )

    val scale by animateFloatAsState(
        label = "scaling content",
        targetValue = if (pointerState == MotionEvent.ACTION_DOWN) scaleFactor else 1f,
        animationSpec = spring(
            stiffness = Spring.StiffnessVeryLow
        )
    )

    return this then Modifier
        .scale(scale)
        .clip(shape = RoundedCornerShape(radius))
        .pointerInteropFilter {
            when (it.action) {

                MotionEvent.ACTION_DOWN -> pointerState = MotionEvent.ACTION_DOWN

                MotionEvent.ACTION_UP -> {
                    view.performHapticFeedback(HapticFeedbackConstantsCompat.LONG_PRESS)
                    pointerState = MotionEvent.ACTION_UP
                    onClick()
                }

                MotionEvent.ACTION_CANCEL -> pointerState = MotionEvent.ACTION_UP
            }
            true
        }
}


@OptIn(ExperimentalComposeUiApi::class)
@Composable
fun Modifier.bounceEffectRotation(
    scaleFactor: Float = .6f,
    onClick: () -> Unit
): Modifier {

    val view = LocalView.current
    var pointerState by remember { mutableIntStateOf(MotionEvent.ACTION_UP) }

    val rotation by animateFloatAsState(
        label = "scaling content",
        targetValue = if (pointerState == MotionEvent.ACTION_DOWN) 0f else 360f,
        animationSpec = spring(
            stiffness = Spring.StiffnessMediumLow
        )
    )

    val scale by animateFloatAsState(
        label = "scaling content",
        targetValue = if (pointerState == MotionEvent.ACTION_DOWN) scaleFactor else 1f,
        animationSpec = spring(
            stiffness = Spring.StiffnessVeryLow
        )
    )

    return this then Modifier
        .scale(scale)
        .rotate(rotation)
        .pointerInteropFilter {
            when (it.action) {

                MotionEvent.ACTION_DOWN -> pointerState = MotionEvent.ACTION_DOWN

                MotionEvent.ACTION_UP -> {
                    view.performHapticFeedback(HapticFeedbackConstantsCompat.LONG_PRESS)
                    pointerState = MotionEvent.ACTION_UP
                    onClick()
                }

                MotionEvent.ACTION_CANCEL -> pointerState = MotionEvent.ACTION_UP
            }
            true
        }
}