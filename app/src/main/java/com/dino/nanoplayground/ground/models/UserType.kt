package com.dino.nanoplayground.ground.models

sealed class UserType {
    data object Nano: UserType()
    data object Dev: UserType()
}