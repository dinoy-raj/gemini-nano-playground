# Nano Playground

Nano Playground is an Android application designed to test and experiment with Google's on-device Generative AI models using ML Kit (`com.google.mlkit:genai-prompt`). It provides a simple chat interface to interact with the on-device AI capabilities without requiring a network connection for inference.

## Features

*   **On-Device GenAI**: Uses Google ML Kit's GenAI features for local, on-device text generation.
*   **Model Status Checking**: Automatically checks the availability and download status of the required on-device models before allowing interaction.
*   **Chat Interface**: A streamlined chat UI built with Jetpack Compose, featuring expandable input fields and markdown rendering for AI responses.
*   **Animated UI**: Utilizes Compose animations, including shared element transitions and bounce effects, for a smooth user experience.

## Tech Stack

This project is built using modern Android development practices and libraries:

*   **Kotlin**: The primary programming language.
*   **Jetpack Compose**: For building the native user interface.
*   **Hilt**: Dependency injection framework for managing application components.
*   **Google ML Kit GenAI**: Provides the on-device generative AI models and inference capabilities.
*   **Material Design 3**: For styling and UI components.
*   **Coroutines & Flows**: For asynchronous programming and state management.

## Project Structure

The codebase is organized primarily within `app/src/main/java/com/dino/nanoplayground`:

*   **`core/`**: Contains core utilities, such as custom Compose modifiers (e.g., `BounceEffect`).
*   **`ground/`**: The main feature module containing the UI and business logic.
    *   **`models/`**: Data classes representing application state (e.g., `HomeState`, `FeatureAvailability`).
    *   **`ui/`**: Compose UI components and screens.
        *   **`components/`**: Reusable UI elements like `ChatContent`, `ChatOptions`, and `UserQueryField`.
        *   **`sections/`**: Main screen layouts like `ChatScreen`, `FeatureStatusCheckingScreen`, etc.
        *   **`viewmodel/`**: Contains the `ChatViewModel` which handles the logic for checking model status and executing prompts.
*   **`ui/theme/`**: Theme definitions for the application (colors, typography).

## Architecture

The application follows the Model-View-ViewModel (MVVM) architecture pattern:
*   **View**: Jetpack Compose screens (`NanoGroundScreen`, `ChatScreen`) observe state from the ViewModel and handle user interactions.
*   **ViewModel**: `ChatViewModel` manages the state (`HomeState`), interacts with the `GenerativeModel`, and exposes data streams (`MutableStateFlow`, `StateFlow`) to the UI.

## Setup Instructions

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd gemini-nano-playground
    ```
2.  **Open in Android Studio**:
    Open the project using a recent version of Android Studio (preferably Ladybug or newer to fully support Compose and AGP 8.x/9.x).
3.  **Requirements**:
    *   The app requires a minimum SDK of **33** (Android 13).
    *   Target SDK is **36**.
    *   A physical device or emulator running Android 13 or higher. Note that on-device GenAI models may have specific hardware requirements or might need to download initial models upon first run.

## Building and Running

You can build and run the app directly from Android Studio or using Gradle from the command line:

```bash
# To run tests
./gradlew test

# To build the debug APK
./gradlew assembleDebug
```

## Resources

*   **Presentation / Slides**: [Supercharging Android Apps with On-Device AI (Gemini Nano Prompt API) - Droid Con Uganda 2025](https://www.slideshare.net/slideshow/supercharging-android-apps-with-on-device-ai-gemini-nano-prompt-api-droid-con-uganda-2025-session-by-dinoy-raj/286727617)
*   **Prompt API Documentation**: [Get started with the ML Kit GenAI Prompt API for Android](https://developers.google.com/ml-kit/genai/prompt/android/get-started)
