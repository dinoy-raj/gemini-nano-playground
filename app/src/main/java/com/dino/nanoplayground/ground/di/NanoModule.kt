package com.dino.nanoplayground.ground.di

import com.google.mlkit.genai.prompt.Generation
import com.google.mlkit.genai.prompt.GenerativeModel
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
class NanoModule {
    @Singleton
    @Provides
    fun provideGenerativeModel(): GenerativeModel = Generation.getClient()
}