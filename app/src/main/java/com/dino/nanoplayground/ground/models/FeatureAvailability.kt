package com.dino.nanoplayground.ground.models

sealed class FeatureAvailability {
    data object Checking: FeatureAvailability()
    data object UnAvailable: FeatureAvailability()
    data object Available: FeatureAvailability()
}
