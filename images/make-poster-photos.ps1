# Makes the photos used on the Instagram Story poster.
# Each photo in images/ is cropped to 4:3, shrunk to 800x600, and saved as
# images/poster-photos/<type>.js (the picture written out as text).
# Why: browsers won't let a page export a picture that has a photo file
# drawn into it when the quiz is opened straight from your computer
# (file://). A photo stored as text inside the page is always allowed.
#
# Run again after changing any photo:
#   powershell -ExecutionPolicy Bypass -File images\make-poster-photos.ps1
Add-Type -AssemblyName System.Drawing
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$out = Join-Path $here "poster-photos"
New-Item -ItemType Directory -Force $out | Out-Null

$W = 800; $H = 600
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$params = New-Object System.Drawing.Imaging.EncoderParameters 1
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality, [long]82)

Get-ChildItem $here -Filter *.jpg | ForEach-Object {
  $type = $_.BaseName
  $src = [System.Drawing.Image]::FromFile($_.FullName)
  # Same crop as the website: fill the 4:3 box, focused a bit above center
  $scale = [Math]::Max($W / $src.Width, $H / $src.Height)
  $dw = $src.Width * $scale; $dh = $src.Height * $scale
  $bmp = New-Object System.Drawing.Bitmap $W, $H
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($src, [float](($W - $dw) / 2), [float](($H - $dh) * 0.4), [float]$dw, [float]$dh)
  $ms = New-Object System.IO.MemoryStream
  $bmp.Save($ms, $codec, $params)
  $b64 = [Convert]::ToBase64String($ms.ToArray())
  $js = "(window.POSTER_PHOTOS = window.POSTER_PHOTOS || {})[`"$type`"] = `"data:image/jpeg;base64,$b64`";`n"
  [IO.File]::WriteAllText((Join-Path $out "$type.js"), $js)
  $g.Dispose(); $bmp.Dispose(); $src.Dispose(); $ms.Dispose()
  "{0,-12} {1,7:N0} KB" -f $type, ($js.Length / 1KB)
}
