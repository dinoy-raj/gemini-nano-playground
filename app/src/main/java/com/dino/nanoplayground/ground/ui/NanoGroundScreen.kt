package com.dino.nanoplayground.ground.ui

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import com.dino.nanoplayground.R
import com.dino.nanoplayground.ground.models.FeatureAvailability
import com.dino.nanoplayground.ground.ui.sections.ChatScreen
import com.dino.nanoplayground.ground.ui.sections.FeatureDownloadingScreen
import com.dino.nanoplayground.ground.ui.sections.FeatureStatusCheckingScreen
import com.dino.nanoplayground.ground.ui.sections.FeatureUnAvailableScreen
import com.dino.nanoplayground.ground.ui.viewmodel.ChatViewModel

@Composable
fun NanoGroundScreen(
    modifier: Modifier = Modifier,
    viewModel: ChatViewModel,
    intentPrompt: String,
    onNavigate: (Any) -> Unit
) {

    val state by viewModel.homeState


    AnimatedContent(
        modifier = modifier.fillMaxSize(),
        targetState = state.featureAvailability,
        transitionSpec = { fadeIn() togetherWith fadeOut() }) {
        when (it) {
            FeatureAvailability.Checking -> FeatureStatusCheckingScreen()
            FeatureAvailability.Downloading -> FeatureDownloadingScreen(state.downloadProgress)
            FeatureAvailability.UnAvailable -> FeatureUnAvailableScreen()
            FeatureAvailability.ConnectionError -> FeatureUnAvailableScreen(stringResource(R.string.connection_error_message))
            FeatureAvailability.Available -> ChatScreen(viewModel, intentPrompt, onNavigate)
        }
    }
}