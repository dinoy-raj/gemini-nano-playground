package com.dino.nanoplayground.ground.models

data class HomeState(
    val featureAvailability: FeatureAvailability = FeatureAvailability.Checking,
    val nanoVersion: String? = null,
    val nanoTokenLimit: Int = 0,
    val isInferencing: Boolean = false,
    val downloadProgress: Float = 0f,
    val finishReason: String = "",
    val inferenceTime: Float = 0f,
    val responseTokenCount: Int = 0,
)
