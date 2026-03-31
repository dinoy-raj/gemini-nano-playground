package com.dino.nanoplayground.ground.models

data class HomeState(
    val featureAvailability: FeatureAvailability = FeatureAvailability.Checking,
    val nanoVersion: String? = null,
    val nanoTokenLimit: Int = 0,
    val isInferencing: Boolean = false
)
