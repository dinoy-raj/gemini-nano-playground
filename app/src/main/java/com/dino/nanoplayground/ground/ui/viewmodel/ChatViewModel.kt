package com.dino.nanoplayground.ground.ui.viewmodel


import androidx.compose.runtime.Stable
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.dino.nanoplayground.ground.models.FeatureAvailability
import com.dino.nanoplayground.ground.models.HomeState
import com.google.mlkit.genai.common.FeatureStatus
import com.google.mlkit.genai.prompt.Generation
import com.google.mlkit.genai.prompt.GenerativeModel
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@Stable
@HiltViewModel
class ChatViewModel @Inject constructor() : ViewModel() {

    val response = mutableStateListOf<String>()
    val generativeModel = Generation.getClient()
    var homeState = mutableStateOf<HomeState>(HomeState())
        private set

    private val _countDown = MutableStateFlow(0)
    val countDown = _countDown.asStateFlow()
    var countDownJob: Job? = null

    init {
        checkForFeatureStatus()
        {
            viewModelScope.launch {
                if (homeState.value.featureAvailability == FeatureAvailability.Available) {
                    collectNanoConfigurations(generativeModel)
                    generativeModel.warmup()
                }
            }
        }
    }

    fun collectNanoConfigurations(generativeModel: GenerativeModel) = viewModelScope.launch {
        homeState.value = homeState.value.copy(
            nanoVersion = generativeModel.getBaseModelName(),
            nanoTokenLimit = generativeModel.getTokenLimit()
        )
    }


    private fun checkForFeatureStatus(runInference: () -> Unit) = viewModelScope.launch {
        val status = generativeModel.checkStatus()

        when (status) {
            FeatureStatus.UNAVAILABLE -> {
                homeState.value = homeState.value.copy(
                    featureAvailability = FeatureAvailability.UnAvailable
                )
            }

            FeatureStatus.DOWNLOADABLE -> {
                homeState.value = homeState.value.copy(
                    featureAvailability = FeatureAvailability.Available
                )
                runInference()
            }

            FeatureStatus.DOWNLOADING -> {
                homeState.value = homeState.value.copy(
                    featureAvailability = FeatureAvailability.Available
                )
                runInference()
            }

            FeatureStatus.AVAILABLE -> {
                homeState.value = homeState.value.copy(
                    featureAvailability = FeatureAvailability.Available
                )
                runInference()
            }
        }
    }


    fun runInference(prompt: String) = viewModelScope.launch {

        homeState.value = homeState.value.copy(
            isInferencing = true
        )
        startCountDown()
        checkForFeatureStatus {
            sendRequest(prompt)
        }
    }

    fun sendRequest(prompt: String) = viewModelScope.launch {
        val request = generativeModel.generateContent(prompt)
        response.clear()
        request.candidates.forEach {
            response.add(it.text)
        }
        homeState.value = homeState.value.copy(
            isInferencing = false
        )
        stopCountDown()
    }

    fun startCountDown() {
        countDownJob?.cancel()
        _countDown.value = 0
        countDownJob = viewModelScope.launch {
            for (i in (1..1000)) {
                delay(1000)
                _countDown.value = i
            }
        }
    }

    fun stopCountDown() {
        countDownJob?.cancel()
        countDownJob = null
    }

    override fun onCleared() {
        super.onCleared()
    }

}