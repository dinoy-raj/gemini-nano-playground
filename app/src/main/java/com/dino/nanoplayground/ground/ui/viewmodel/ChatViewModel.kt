package com.dino.nanoplayground.ground.ui.viewmodel


import androidx.compose.runtime.Stable
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.dino.nanoplayground.ground.models.FeatureAvailability
import com.dino.nanoplayground.ground.models.HomeState
import com.google.mlkit.genai.common.FeatureStatus
import com.google.mlkit.genai.prompt.GenerateContentResponse
import com.google.mlkit.genai.prompt.GenerativeModel
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

@Stable
@HiltViewModel
class ChatViewModel @Inject constructor(private val generativeModel: GenerativeModel) :
    ViewModel() {

    private val _response = MutableStateFlow<String>("")
    val response = _response.asStateFlow()
    var homeState = mutableStateOf<HomeState>(HomeState())
        private set


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


    private fun checkForFeatureStatus(onAvailable: () -> Unit) = viewModelScope.launch(
        Dispatchers.IO
    ) {
        val status = generativeModel.checkStatus()

        when (status) {
            FeatureStatus.UNAVAILABLE -> setFeatureAvailability(FeatureAvailability.UnAvailable)

            FeatureStatus.DOWNLOADABLE -> {
                setFeatureAvailability(FeatureAvailability.Available)
                onAvailable()
            }

            FeatureStatus.DOWNLOADING -> {
                setFeatureAvailability(FeatureAvailability.Available)
                onAvailable()
            }

            FeatureStatus.AVAILABLE -> {
                setFeatureAvailability(FeatureAvailability.Available)
                onAvailable()
            }
        }
    }


    fun executePrompt(prompt: String) {
        setInferenceState(true)
        startCountDown()
        clearResponse()
        checkForFeatureStatus {
            sendRequest(prompt)
        }
    }

    fun sendRequest(prompt: String) = viewModelScope.launch(Dispatchers.IO) {
        try {
            generativeModel.generateContentStream(prompt).collect {
                if(homeState.value.isInferencing)
                {
                    setInferenceState(false)
                }
                _response.update { oldValue ->
                    oldValue + it.candidates[0].text
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        } finally {
            setInferenceState(false)
            stopCountDown()
        }
    }


    private val _countDown = MutableStateFlow(0)
    val countDown = _countDown.asStateFlow()
    var countDownJob: Job? = null

    private fun startCountDown() {
        countDownJob?.cancel()
        _countDown.value = 0
        countDownJob = viewModelScope.launch {
            for (i in (1..1000)) {
                delay(1000)
                _countDown.value = i
            }
        }
    }

    private fun stopCountDown() {
        countDownJob?.cancel()
        countDownJob = null
    }

    override fun onCleared() {
        super.onCleared()
        generativeModel.close()
    }


    private fun setInferenceState(state: Boolean) = viewModelScope.launch {
        homeState.value = homeState.value.copy(isInferencing = state)
    }

    private fun clearResponse() = viewModelScope.launch {
        _response.update { "" }
    }

    private fun setFeatureAvailability(availability: FeatureAvailability) = viewModelScope.launch {
        homeState.value = homeState.value.copy(featureAvailability = availability)
    }


    fun clearModelCache() = viewModelScope.launch(Dispatchers.IO) {
        generativeModel.clearImplicitCaches()
    }

}