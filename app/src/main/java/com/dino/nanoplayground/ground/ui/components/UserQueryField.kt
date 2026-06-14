package com.dino.nanoplayground.ground.ui.components

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.AnimatedContentScope
import androidx.compose.animation.BoundsTransform
import androidx.compose.animation.ExperimentalSharedTransitionApi
import androidx.compose.animation.SharedTransitionScope
import androidx.compose.animation.animateColor
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.CleaningServices
import androidx.compose.material.icons.rounded.ContentPasteGo
import androidx.compose.material3.ExperimentalMaterial3ExpressiveApi
import androidx.compose.material3.LocalTextStyle
import androidx.compose.material3.MaterialShapes
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.material3.toShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawOutline
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.LocalClipboard
import androidx.compose.ui.platform.LocalSoftwareKeyboardController
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.dino.nanoplayground.R
import kotlinx.coroutines.launch


@OptIn(ExperimentalMaterial3ExpressiveApi::class, ExperimentalSharedTransitionApi::class)
@Composable
fun UserQueryField(
    modifier: Modifier = Modifier,
    isExpanded: Boolean,
    sharedTransitionScope: SharedTransitionScope,
    intentPrompt: String,
    onFocusDismiss: (String) -> Unit
) {

    var query by remember { mutableStateOf(intentPrompt) }


    val infiniteTransition = rememberInfiniteTransition(label = "placeholder")
    val color by infiniteTransition.animateColor(
        initialValue = MaterialTheme.colorScheme.onSurfaceVariant,
        targetValue = MaterialTheme.colorScheme.surfaceContainerHighest,
        animationSpec = infiniteRepeatable(
            animation = tween(3000, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "color"
    )

    val backgroundColor = MaterialTheme.colorScheme.surfaceContainerHighest


    Box(modifier = modifier, contentAlignment = Alignment.Center)
    {
        Box(
            modifier = Modifier
                .padding(8.dp)
                .fillMaxSize()
                .drawBehind {
                    val strokeWidth = 1.dp.toPx()
                    val shape = RoundedCornerShape(36.dp)
                    val outline = shape.createOutline(size, layoutDirection, this)

                    drawOutline(
                        outline = outline,
                        color = backgroundColor
                    )

                    drawOutline(
                        outline = outline,
                        color = color,
                        style = Stroke(width = strokeWidth)
                    )
                },
            contentAlignment = Alignment.Center
        )
        {
            AnimatedContent(
                targetState = isExpanded,
                transitionSpec = { fadeIn() togetherWith fadeOut() }) { state ->
                when (state) {
                    true -> FieldExpandedLayout(
                        animatedVisibilityScope = this@AnimatedContent,
                        sharedTransitionScope = sharedTransitionScope,
                        query = query,
                        onQueryChange = { query = it },
                        onFocusDismiss = { onFocusDismiss(query) }
                    )

                    false -> FieldShrankLayout(
                        animatedVisibilityScope = this@AnimatedContent,
                        sharedTransitionScope = sharedTransitionScope,
                        query = query,
                        onQueryChange = { query = it },
                        onFocusDismiss = { onFocusDismiss(query) }
                    )
                }
            }
        }
    }
}


@OptIn(ExperimentalSharedTransitionApi::class, ExperimentalMaterial3ExpressiveApi::class)
@Composable
private fun FieldExpandedLayout(
    query: String,
    onQueryChange: (String) -> Unit,
    onFocusDismiss: (String) -> Unit,
    animatedVisibilityScope: AnimatedContentScope,
    sharedTransitionScope: SharedTransitionScope
) {
    with(sharedTransitionScope) {
        val infiniteTransition = rememberInfiniteTransition(label = "placeholder")
        val color by infiniteTransition.animateColor(
            initialValue = MaterialTheme.colorScheme.onSurfaceVariant,
            targetValue = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = .5f),
            animationSpec = infiniteRepeatable(
                animation = tween(3000, easing = FastOutSlowInEasing),
                repeatMode = RepeatMode.Reverse
            ),
            label = "color"
        )

        val keyboardManager = LocalSoftwareKeyboardController.current
        val clipboardManager = LocalClipboard.current
        val scope = rememberCoroutineScope()


        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(4.dp)
        ) {

            Box(
                modifier = Modifier
                    .weight(2f)
                    .fillMaxWidth()
                    .padding(8.dp),
                contentAlignment = Alignment.Center
            )
            {
                TextField(
                    placeholder = {
                        Text(
                            modifier = Modifier
                                .padding(start = 16.dp),
                            text = stringResource(R.string.type_your_prompt),
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Medium,
                            color = color,
                            textAlign = TextAlign.Start,
                        )

                    },
                    value = query,
                    onValueChange = { onQueryChange(it) },
                    modifier = Modifier.sharedElement(
                        rememberSharedContentState(key = "query_field"),
                        animatedVisibilityScope = animatedVisibilityScope,
                        placeholderSize = SharedTransitionScope.PlaceholderSize.AnimatedSize,
                        boundsTransform = BoundsTransform { _, _ -> spring(stiffness = Spring.StiffnessLow) }
                    ),
                    colors = TextFieldDefaults.colors().copy(
                        unfocusedIndicatorColor = Color.Transparent,
                        focusedIndicatorColor = Color.Transparent
                    ),
                    textStyle = LocalTextStyle.current.copy(
                        fontSize = 20.sp,
                        lineHeight = 30.sp,
                        fontWeight = FontWeight.Bold,
                        textAlign = TextAlign.Start
                    ),
                    maxLines = 8,
                    shape = RoundedCornerShape(48.dp),
                    keyboardOptions = KeyboardOptions(
                        imeAction = ImeAction.Done,
                        keyboardType = KeyboardType.Text,
                    ),
                    keyboardActions = KeyboardActions(
                        onDone = { keyboardManager?.hide() }
                    ),
                )
            }

            Spacer(modifier = Modifier.width(8.dp))

            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth(),
                contentAlignment = Alignment.Center
            )
            {

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.Center
                )
                {

                    ActionButton(
                        isActive = true,
                        icon = Icons.Rounded.ContentPasteGo,
                        shape = MaterialShapes.Slanted.toShape(),
                        activeColor = MaterialTheme.colorScheme.onSurfaceVariant,
                        size = 48.dp
                    )
                    {
                        scope.launch {
                            clipboardManager.getClipEntry()?.let {
                                onQueryChange(it.clipData.getItemAt(0).text.toString())
                            }
                        }
                    }


                    Spacer(Modifier.width(16.dp))

                    ActionButton(
                        isActive = true,
                        modifier = Modifier.sharedElement(
                            sharedContentState = rememberSharedContentState(key = "submit_button"),
                            animatedVisibilityScope = animatedVisibilityScope,
                            placeholderSize = SharedTransitionScope.PlaceholderSize.AnimatedSize,
                            boundsTransform = BoundsTransform { _, _ -> spring(stiffness = Spring.StiffnessLow) }
                        ),
                        size = 120.dp
                    )
                    {
                        onFocusDismiss(query)
                    }

                    Spacer(Modifier.width(16.dp))

                    ActionButton(
                        isActive = true,
                        icon = Icons.Rounded.CleaningServices,
                        shape = MaterialShapes.Gem.toShape(),
                        activeColor = MaterialTheme.colorScheme.onSurfaceVariant,
                        size = 48.dp
                    )
                    {
                        onQueryChange("")
                    }
                }
            }
        }
    }
}


@OptIn(ExperimentalSharedTransitionApi::class)
@Composable
private fun FieldShrankLayout(
    query: String,
    onQueryChange: (String) -> Unit,
    onFocusDismiss: (String) -> Unit,
    animatedVisibilityScope: AnimatedContentScope,
    sharedTransitionScope: SharedTransitionScope
) {

    with(sharedTransitionScope) {
        val infiniteTransition = rememberInfiniteTransition(label = "placeholder")
        val color by infiniteTransition.animateColor(
            initialValue = MaterialTheme.colorScheme.onSurfaceVariant,
            targetValue = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = .5f),
            animationSpec = infiniteRepeatable(
                animation = tween(3000, easing = FastOutSlowInEasing),
                repeatMode = RepeatMode.Reverse
            ),
            label = "color"
        )

        val keyboardManager = LocalSoftwareKeyboardController.current


        Row(verticalAlignment = Alignment.CenterVertically) {

            Box(
                modifier = Modifier
                    .fillMaxHeight()
                    .weight(3f)
                    .padding(8.dp),
                contentAlignment = Alignment.Center
            )
            {
                TextField(
                    readOnly = true,
                    placeholder = {
                        Text(
                            modifier = Modifier
                                .padding(start = 16.dp),
                            text = stringResource(R.string.type_your_prompt),
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Medium,
                            color = color,
                            textAlign = TextAlign.Start,
                        )

                    },
                    value = query,
                    onValueChange = { onQueryChange(it) },
                    modifier = Modifier.sharedElement(
                        rememberSharedContentState(key = "query_field"),
                        animatedVisibilityScope = animatedVisibilityScope,
                        placeholderSize = SharedTransitionScope.PlaceholderSize.AnimatedSize,
                        boundsTransform = BoundsTransform { _, _ -> spring(stiffness = Spring.StiffnessLow) }
                    ),
                    colors = TextFieldDefaults.colors().copy(
                        unfocusedIndicatorColor = Color.Transparent,
                        focusedIndicatorColor = Color.Transparent
                    ),
                    textStyle = LocalTextStyle.current.copy(
                        fontSize = 10.sp,
                        textAlign = TextAlign.Start
                    ),
                    maxLines = 1,
                    shape = RoundedCornerShape(48.dp),
                    keyboardOptions = KeyboardOptions(
                        imeAction = ImeAction.Done,
                        keyboardType = KeyboardType.Text,
                    ),
                    keyboardActions = KeyboardActions(
                        onDone = { keyboardManager?.hide() }
                    ),
                )
            }

            Spacer(modifier = Modifier.width(8.dp))

            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxHeight(), contentAlignment = Alignment.Center
            )
            {
                ActionButton(
                    isActive = false,
                    modifier = Modifier.sharedElement(
                        rememberSharedContentState(key = "submit_button"),
                        animatedVisibilityScope = animatedVisibilityScope,
                        placeholderSize = SharedTransitionScope.PlaceholderSize.AnimatedSize,
                        boundsTransform = BoundsTransform { _, _ -> spring(stiffness = Spring.StiffnessLow) }
                    ),
                    size = 50.dp
                )
                {
                    onFocusDismiss(query)
                }
            }
        }
    }
}
