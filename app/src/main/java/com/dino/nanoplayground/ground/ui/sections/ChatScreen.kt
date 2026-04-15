package com.dino.nanoplayground.ground.ui.sections

import androidx.activity.compose.BackHandler
import androidx.compose.animation.ExperimentalSharedTransitionApi
import androidx.compose.animation.SharedTransitionLayout
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.dino.nanoplayground.core.bounceEffect
import com.dino.nanoplayground.ground.ui.components.ChatContent
import com.dino.nanoplayground.ground.ui.components.ChatOptions
import com.dino.nanoplayground.ground.ui.components.UserQueryField
import com.dino.nanoplayground.ground.ui.viewmodel.ChatViewModel

@OptIn(ExperimentalSharedTransitionApi::class)
@Composable
fun ChatScreen(viewModel: ChatViewModel, onNavigate: (Any) -> Unit) {

    val state by viewModel.homeState
    var isFieldExpended by remember { mutableStateOf(false) }

    val fieldWeight by animateFloatAsState(
        targetValue = if (isFieldExpended) 8f else 1.3f,
        animationSpec = spring(stiffness = Spring.StiffnessLow)
    )


    val bodyWeight by animateFloatAsState(
        targetValue = if (isFieldExpended) .1f else 8f,
        animationSpec = spring(stiffness = Spring.StiffnessLow)
    )

    val bodyVisibility by animateFloatAsState(
        targetValue = if (isFieldExpended) 0f else 1f,
        animationSpec = spring(stiffness = Spring.StiffnessLow)
    )

    BackHandler(enabled = isFieldExpended) {
        isFieldExpended = !isFieldExpended
    }

    val countDown by viewModel.countDown.collectAsStateWithLifecycle()

    SharedTransitionLayout {

        Column(
            Modifier
                .padding(16.dp)
                .fillMaxSize()
        )
        {

            // chat
            ChatContent(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(bodyWeight)
                    .alpha(bodyVisibility),
                isInferencing = state.isInferencing,
                viewModel.response
            )

            // header
            ChatOptions(
                modifier = Modifier
                    .height(100.dp)
                    .fillMaxWidth(),
                countDown = countDown,
                isInferencing = state.isInferencing,
                onNavigate = onNavigate,
                onCacheClear = viewModel::clearModelCache
            )

            // query field
            UserQueryField(
                modifier = Modifier
                    .bounceEffect(
                        scaleFactor = .98f,
                        intercept = !isFieldExpended,
                        onClick = { isFieldExpended = true })
                    .fillMaxWidth()
                    .weight(fieldWeight),
                isExpanded = isFieldExpended,
                sharedTransitionScope = this@SharedTransitionLayout
            )
            {
                if (isFieldExpended) {
                    isFieldExpended = false
                }
                if (!it.isBlank()) {
                    viewModel.executePrompt(it)
                }
            }

        }
    }
}