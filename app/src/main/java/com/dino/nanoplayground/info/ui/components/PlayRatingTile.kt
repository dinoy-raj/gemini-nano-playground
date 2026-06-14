package com.dino.nanoplayground.info.ui.components

import android.content.Intent
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Arrangement.Center
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.AutoAwesome
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.net.toUri
import com.dino.nanoplayground.core.bounceEffect


// ----------------------------------------- Component ---------------------------------------------
/**
 * A Composable that displays a "Rate Us" tile.
 *
 * This tile is designed to encourage users to leave a review on the Play Store.
 * It features a sparkle icon, a text prompt, and another sparkle icon.
 * Clicking on the tile will attempt to open the app's page on the Play Store.
 *
 * @param arrangement The horizontal arrangement of the content within the tile. Defaults to [Arrangement.Center].
 */
@Composable
fun PlayRatingTile(
    arrangement: Arrangement.Horizontal = Center,
    isVibrationEnabled: Boolean = true
)
{

    // general state
    val context = LocalContext.current

    // layout
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 32.dp)
            .border(
                width = 1.dp,
                shape = RoundedCornerShape(16.dp),
                color = MaterialTheme.colorScheme.surfaceVariant

            )
            .bounceEffect(scaleFactor = .95f, intercept = isVibrationEnabled) {
                try {
                    val intent = Intent(Intent.ACTION_VIEW)
                    intent.data = ("market://details?id=" + context.packageName).toUri()
                    context.startActivity(intent)
                } catch (_: Exception) {

                }
            }
    )
    {
        Column {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(12.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = arrangement
            ) {
                Icon(
                    imageVector = Icons.Rounded.AutoAwesome,
                    tint = MaterialTheme.colorScheme.primary,
                    contentDescription = "",
                    modifier = Modifier.size(16.dp)
                )
                Spacer(Modifier.width(12.dp))
                Text(
                    modifier = Modifier,
                    text = "Leave a Review On Play Store",
                    color = MaterialTheme.colorScheme.primary,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Medium
                )
                Spacer(Modifier.width(12.dp))
                Icon(
                    imageVector = Icons.Rounded.AutoAwesome,
                    tint = MaterialTheme.colorScheme.primary,
                    contentDescription = "",
                    modifier = Modifier.size(16.dp)
                )
            }
        }

    }
}


// ----------------------------------------- Preview -----------------------------------------------

@Preview
@Composable
fun RateUsTilePreview() {
    PlayRatingTile()
}
