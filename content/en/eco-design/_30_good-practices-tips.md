+++
id = "good-practices-tips"
weight = 30
+++

{{% info_2_columns %}}

{{% info_2_columns_col1 %}}

## Some good practices

{{% /info_2_columns_col1 %}}

{{% info_2_columns_col2 %}}

Here are some good practices to start with !

### Reduce page weight

- **Optimize images: choose the right format and reduce the size.** For logos and illustrations: Use SVG format. For photos: prefer WebP format or optimized jpeg. For icons: pick glyphs or CSS styles.
- **Avoid videos** or minimize their lenght. Provide several formats suitable for viewing contexts, or use services offering optimized formats. Disable autoplay.
- **Compress files**: HTML, CSS, JS...
- **Enable browser caching** during development to avoid reloading the same data when revisiting  

### Reduce page complexity

- **Limit content and features to the essential.** 45% of features are never used: question the reel need.
- **Opt for mobile-first approach** before designing for desktop. This allows a functional coverage limited to the essential,  avoids unnecessary consumption of bandwidth and ensure smooth running on mobile devices.
- **Avoid infinite scroll.** Prefer user action to display more information.
- **Avoid costly Javascript animations, like carousels.** Prefer regular content updates.

### Limit requests number

- **Use system fonts** (Arial, Tahoma, Times New Roman, Verdana...), which don't need to be downloaded, unlike custom fonts.
- **Limit widgets and plugins.** For example: switch from social media buttons or Googlemaps widget to an image with a link.
- **Group images into a sprite** and combine certain CSS stylesheets and JavaScript libraries.
- **Prefer static webpages** when possible, rather than using a CMS. You can use static site generators or Jamstack architecture.

{{% /info_2_columns_col2 %}}

{{% /info_2_columns %}}
