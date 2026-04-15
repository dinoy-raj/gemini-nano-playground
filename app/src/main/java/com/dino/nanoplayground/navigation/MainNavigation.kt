package com.dino.nanoplayground.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.navigation3.runtime.entryProvider
import androidx.navigation3.ui.NavDisplay
import com.dino.nanoplayground.ground.ui.NanoGroundScreen

data object Ground
data object Settings
data object Info
data object Documentation


@Composable
fun MainNavigation(modifier: Modifier = Modifier) {
    val backStack = remember { mutableStateListOf<Any>(Ground) }

    NavDisplay(
        modifier = modifier,
        backStack = backStack,
        entryProvider = entryProvider {
            entry<Ground> {
                NanoGroundScreen()
                {
                    backStack.add(it)
                }
            }
            entry<Settings> {}
            entry<Info> {}
            entry<Documentation> {}
        }
    )
}