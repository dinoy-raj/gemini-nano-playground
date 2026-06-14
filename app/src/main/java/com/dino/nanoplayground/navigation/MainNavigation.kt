package com.dino.nanoplayground.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import androidx.navigation3.runtime.entryProvider
import androidx.navigation3.ui.NavDisplay
import com.dino.nanoplayground.core.NanoTransitionSpecs
import com.dino.nanoplayground.ground.ui.NanoGroundScreen
import com.dino.nanoplayground.ground.ui.viewmodel.ChatViewModel
import com.dino.nanoplayground.info.ui.InfoScreen

data object Ground
data object Settings
data object Info
data object Documentation


@Composable
fun MainNavigation(
    modifier: Modifier = Modifier,
    intentPrompt: String,
    viewModel: ChatViewModel = hiltViewModel(),
) {
    val backStack = remember { mutableStateListOf<Any>(Ground) }
    val state = viewModel.homeState.value

    NavDisplay(
        modifier = modifier,
        backStack = backStack,
        transitionSpec = { NanoTransitionSpecs.default },
        popTransitionSpec = { NanoTransitionSpecs.default },
        predictivePopTransitionSpec = { NanoTransitionSpecs.default },
        entryProvider = entryProvider {
            entry<Ground> {
                NanoGroundScreen(intentPrompt = intentPrompt, viewModel = viewModel)
                {
                    backStack.add(it)
                }
            }
            entry<Settings> {}
            entry<Info> {
                InfoScreen(
                    nanoVersion = state.nanoVersion.orEmpty(),
                    tokenLimit = state.nanoTokenLimit.toString()
                )
            }
            entry<Documentation> {}
        }
    )
}