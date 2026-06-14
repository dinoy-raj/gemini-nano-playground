package com.dino.nanoplayground.info.ui.sections

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.LinkAnnotation
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.TextLinkStyles
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.withLink
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.dino.nanoplayground.R
import com.dino.nanoplayground.info.ui.components.PlayRatingTile

@Composable
fun InfoFooterSection(modifier: Modifier = Modifier) {
    val context = LocalContext.current
    val packageManager = context.packageManager
    val info = packageManager.getPackageInfo(context.packageName, 0)

    Column(
        modifier = modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.Start,
        verticalArrangement = Arrangement.Top
    )
    {

        // rate us on
        PlayRatingTile()

        Spacer(Modifier.height(32.dp))

        // app version name
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(32.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {

            Text(
                text = buildAnnotatedString {
                    append("Build by  ")

                    withLink(
                        link = LinkAnnotation.Url(
                            url = "https://linktr.ee/dinoyraj",
                            styles = TextLinkStyles(
                                style = SpanStyle(
                                    color = Color.White,
                                    textDecoration = TextDecoration.Underline
                                )
                            )
                        ),
                    )
                    {
                        append("Dinoy Raj")
                    }
                    append(".")
                },
                color = Color.Gray,
                fontWeight = FontWeight.Medium,
                fontSize = 12.sp
            )

            Text(
                modifier = Modifier.padding(top = 4.dp),
                text = stringResource(R.string.version, info.versionName.orEmpty()),
                color = Color.Gray,
                fontSize = 10.sp
            )
        }

        Spacer(Modifier.height(200.dp))
    }
}