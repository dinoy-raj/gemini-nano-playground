package com.dino.nanoplayground.ground.models

sealed class FeatureAvailability {
    data object Checking: FeatureAvailability()

    data object Downloading : FeatureAvailability()
    data object UnAvailable: FeatureAvailability()
    data object ConnectionError : FeatureAvailability()
    data class Error(val message: String) : FeatureAvailability()
    data object Available: FeatureAvailability()
}
