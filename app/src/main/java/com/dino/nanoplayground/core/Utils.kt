package com.dino.nanoplayground.core

import android.content.Intent

fun Intent.getSharedTextContent(): String {
    return if (this.action == Intent.ACTION_SEND && "text/plain" == this.type) this.getStringExtra(
        Intent.EXTRA_TEXT
    ) ?: "" else ""
}