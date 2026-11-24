# Makes the link previews: the picture + title that show up when someone
# pastes a quiz link into KakaoTalk, iMessage, WhatsApp, Instagram DMs...
#
# Link previews are read by robots that DON'T run JavaScript, so the quiz
# itself can't tell them your result. Instead, a shared result links to a
# tiny page per type (share/lookout.html?path=...). That page has the
# preview tags for its type, then sends the visitor on to index.html with
# the same ?path=..., so they land on the result like before.
#
# This script makes, for every type, in English and Korean:
#   share/<type>.html, share/<type>-ko.html       (the tiny pages)
#   share/images/<type>-en.jpg, <type>-ko.jpg     (1200x630 preview cards)
# plus share/images/quiz-en.jpg and quiz-ko.jpg for plain links to the quiz.
#
# Names and taglines come from RESULTS in script.js and KO in ko.js, so
# run this again after changing a name, a tagline or a photo:
#   powershell -ExecutionPolicy Bypass -File share\make-share-pages.ps1
#
# Fonts: the storybook fonts (Henny Penny, Jua; both free, SIL Open Font
# License) are downloaded once from Google Fonts into your temp folder.

$SiteUrl = "https://only-yestherday.github.io/Into-the-Woods-Personality-Quiz/"

Add-Type -AssemblyName System.Drawing
$ErrorActionPreference = "Stop"
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$root = Split-Path -Parent $here
$imgOut = Join-Path $here "images"
New-Item -ItemType Directory -Force $imgOut | Out-Null
$utf8 = New-Object System.Text.UTF8Encoding $false

# ---------------------------------------------------------
# Read the text from script.js and ko.js
# ---------------------------------------------------------
$scriptJs = [IO.File]::ReadAllText((Join-Path $root "script.js"), $utf8)
$koJs = [IO.File]::ReadAllText((Join-Path $root "ko.js"), $utf8)
$indexHtml = [IO.File]::ReadAllText((Join-Path $root "index.html"), $utf8)

function Unescape-Js([string]$s) { return $s -replace '\\"', '"' -replace "\\'", "'" -replace '\\\\', '\' }

$types = [ordered]@{}
$enRe = '(?m)^  (\w+): \{\r?\n    name: "((?:[^"\\]|\\.)*)",\r?\n    tagline: "((?:[^"\\]|\\.)*)"'
foreach ($m in [regex]::Matches($scriptJs, $enRe)) {
  $types[$m.Groups[1].Value] = @{ enName = (Unescape-Js $m.Groups[2].Value); enTagline = (Unescape-Js $m.Groups[3].Value) }
}
$koRe = '(?m)^    (\w+): \{\r?\n      name: `([^`]*)`,\r?\n      tagline: `([^`]*)`'
foreach ($m in [regex]::Matches($koJs, $koRe)) {
  if ($types.Contains($m.Groups[1].Value)) {
    $types[$m.Groups[1].Value].koName = $m.Groups[2].Value
    $types[$m.Groups[1].Value].koTagline = $m.Groups[3].Value
  }
}
if ($types.Count -ne 14) { throw "Expected 14 types in script.js, found $($types.Count)" }
foreach ($k in $types.Keys) { if (-not $types[$k].koName) { throw "No Korean name/tagline for $k in ko.js" } }

function Get-KoText([string]$key) {
  $m = [regex]::Match($koJs, '"' + [regex]::Escape($key) + '": `([^`]*)`')
  if (-not $m.Success) { throw "ko.js is missing $key" }
  return $m.Groups[1].Value
}
function Get-KoHtml([string]$selector) {
  $m = [regex]::Match($koJs, '"' + [regex]::Escape($selector) + '": `([^`]*)`')
  if (-not $m.Success) { throw "ko.js is missing $selector" }
  return $m.Groups[1].Value
}

# The "I got X... which one are you?" line, same as the quiz's share message
$enShare = [regex]::Match($scriptJs, 'shareText", \(type\) => `([^`]*)`').Groups[1].Value
$koShare = [regex]::Match($koJs, 'shareText: \(name\) => `([^`]*)`').Groups[1].Value
if (-not $enShare -or -not $koShare) { throw "Couldn't find shareText in script.js / ko.js" }

# (Keep this file plain ASCII: Windows PowerShell misreads other characters
# in a .ps1 saved without a BOM. That's why ... and the arrow are char codes.)
$ellipsis = [string][char]0x2026; $arrow = [string][char]0x2192
$en = @{
  title    = "Into the Woods"
  subtitle = [regex]::Match($indexHtml, '<p class="subtitle">([^<]*)</p>').Groups[1].Value
  igot     = "I GOT$ellipsis"
  cta      = "Which one are you? $arrow"
  desc     = "A personality quiz told as a short story$ellipsis and every move counts."
}
$ko = @{
  title    = Get-KoHtml "#page1 .title"
  subtitle = Get-KoHtml "#page1 .subtitle"
  igot     = Get-KoText "preview.igot"
  cta      = Get-KoText "preview.cta"
  desc     = Get-KoText "preview.description"
}

# ---------------------------------------------------------
# Fonts
# ---------------------------------------------------------
$fontDir = Join-Path $env:TEMP "into-the-woods-fonts"
New-Item -ItemType Directory -Force $fontDir | Out-Null
$fontFiles = @{
  "HennyPenny-Regular.ttf" = "https://github.com/google/fonts/raw/main/ofl/hennypenny/HennyPenny-Regular.ttf"
  "Jua-Regular.ttf"        = "https://github.com/google/fonts/raw/main/ofl/jua/Jua-Regular.ttf"
}
$pfc = New-Object System.Drawing.Text.PrivateFontCollection
foreach ($f in $fontFiles.Keys) {
  $path = Join-Path $fontDir $f
  if (-not (Test-Path $path)) {
    try { Invoke-WebRequest -UseBasicParsing $fontFiles[$f] -OutFile $path -TimeoutSec 60 } catch { Write-Warning "Couldn't download $f, using a system font instead" }
  }
  if (Test-Path $path) { $pfc.AddFontFile($path) }
}
function Get-Family([string]$name, [string]$fallback) {
  $fam = $pfc.Families | Where-Object { $_.Name -eq $name }
  if ($fam) { return $fam }
  return New-Object System.Drawing.FontFamily $fallback
}
$famHenny = Get-Family "Henny Penny" "Georgia"
$famJua = Get-Family "Jua" "Malgun Gothic"
$famBody = New-Object System.Drawing.FontFamily "Segoe UI"
$famKoBody = New-Object System.Drawing.FontFamily "Malgun Gothic"

# ---------------------------------------------------------
# Drawing helpers
# ---------------------------------------------------------
$W = 1200; $H = 630
function Color([string]$hex, [int]$alpha = 255) {
  $c = [System.Drawing.ColorTranslator]::FromHtml($hex)
  return [System.Drawing.Color]::FromArgb($alpha, $c)
}
$cream = Color "#f4efe2"; $sun = Color "#f2b84b"; $leaf = Color "#8fbf6a"; $soft = Color "#c9d3c3"

function New-Canvas {
  $bmp = New-Object System.Drawing.Bitmap $W, $H
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  # Same forest glow as the website
  $bg = New-Object System.Drawing.Drawing2D.LinearGradientBrush (New-Object System.Drawing.Point 0, 0), (New-Object System.Drawing.Point $W, $H), (Color "#2a4a37"), (Color "#0f1c15")
  $g.FillRectangle($bg, 0, 0, $W, $H); $bg.Dispose()
  # Little sparkles in the corners
  $stars = @(@(40, 40, 9), @(170, 28, 5), @(1150, 46, 8), @(1050, 24, 5), @(28, 300, 6), @(1172, 330, 7), @(610, 22, 5))
  $starBrush = New-Object System.Drawing.SolidBrush (Color "#ffecaa" 190)
  foreach ($s in $stars) { Draw-Sparkle $g $s[0] $s[1] $s[2] $starBrush }
  $starBrush.Dispose()
  # A row of pine trees along the bottom
  $treeBrush = New-Object System.Drawing.SolidBrush (Color "#0c1711" 230)
  $x = -20
  $rand = New-Object Random 7
  while ($x -lt $W + 40) {
    $th = 40 + $rand.Next(40); $tw = 26 + $rand.Next(16)
    $pts = [System.Drawing.PointF[]]@(
      (New-Object System.Drawing.PointF $x, $H),
      (New-Object System.Drawing.PointF ($x + $tw / 2), ($H - $th)),
      (New-Object System.Drawing.PointF ($x + $tw), $H))
    $g.FillPolygon($treeBrush, $pts)
    $x += $tw - 6
  }
  $treeBrush.Dispose()
  return @($bmp, $g)
}

function Draw-Sparkle($g, [float]$x, [float]$y, [float]$r, $brush) {
  $k = $r * 0.28
  $pts = [System.Drawing.PointF[]]@(
    (New-Object System.Drawing.PointF $x, ($y - $r)), (New-Object System.Drawing.PointF ($x + $k), ($y - $k)),
    (New-Object System.Drawing.PointF ($x + $r), $y), (New-Object System.Drawing.PointF ($x + $k), ($y + $k)),
    (New-Object System.Drawing.PointF $x, ($y + $r)), (New-Object System.Drawing.PointF ($x - $k), ($y + $k)),
    (New-Object System.Drawing.PointF ($x - $r), $y), (New-Object System.Drawing.PointF ($x - $k), ($y - $k)))
  $g.FillPolygon($brush, $pts)
}

function Rounded-Path([float]$x, [float]$y, [float]$w, [float]$h, [float]$r) {
  $p = New-Object System.Drawing.Drawing2D.GraphicsPath
  $d = $r * 2
  $p.AddArc($x, $y, $d, $d, 180, 90); $p.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
  $p.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90); $p.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
  $p.CloseFigure()
  return $p
}

# Draw a photo cropped to fill the box (like CSS object-fit: cover, a bit above center)
function Draw-Cover($g, $img, [float]$x, [float]$y, [float]$w, [float]$h, $clip) {
  $scale = [Math]::Max($w / $img.Width, $h / $img.Height)
  $dw = $img.Width * $scale; $dh = $img.Height * $scale
  $state = $g.Save()
  $g.SetClip($clip)
  $g.DrawImage($img, [float]($x + ($w - $dw) / 2), [float]($y + ($h - $dh) * 0.4), [float]$dw, [float]$dh)
  $g.Restore($state)
}

# Text that wraps inside a box, shrinking until it fits. Returns the height used.
# $oneLine: first try to fit it on a single line (down to $minSize);
# only if that fails, wrap it.
function Draw-Fit($g, [string]$text, $family, [System.Drawing.FontStyle]$style, [float]$size, [float]$minSize, $color, [float]$x, [float]$y, [float]$w, [float]$maxH, [string]$align = "near", [bool]$oneLine = $false) {
  $fmt = New-Object System.Drawing.StringFormat
  $fmt.Alignment = if ($align -eq "center") { [System.Drawing.StringAlignment]::Center } else { [System.Drawing.StringAlignment]::Near }
  $fmt.Trimming = [System.Drawing.StringTrimming]::Word
  $s = $size
  if ($oneLine) {
    $fmt.FormatFlags = [System.Drawing.StringFormatFlags]::NoWrap
    while ($s -ge $minSize) {
      $font = New-Object System.Drawing.Font $family, $s, $style, ([System.Drawing.GraphicsUnit]::Pixel)
      $need = $g.MeasureString($text, $font, (New-Object System.Drawing.PointF 0, 0), $fmt)
      if ($need.Width -le $w) {
        $brush = New-Object System.Drawing.SolidBrush $color
        $g.DrawString($text, $font, $brush, (New-Object System.Drawing.RectangleF $x, $y, $w, $maxH), $fmt)
        $h = $need.Height
        $brush.Dispose(); $font.Dispose(); $fmt.Dispose()
        return $h
      }
      $font.Dispose(); $s -= 2
    }
    $fmt.FormatFlags = 0; $s = $size
  }
  while ($true) {
    $font = New-Object System.Drawing.Font $family, $s, $style, ([System.Drawing.GraphicsUnit]::Pixel)
    $need = $g.MeasureString($text, $font, [int]$w, $fmt)
    if ($need.Height -le $maxH -or $s -le $minSize) { break }
    $font.Dispose(); $s -= 2
  }
  $brush = New-Object System.Drawing.SolidBrush $color
  $g.DrawString($text, $font, $brush, (New-Object System.Drawing.RectangleF $x, $y, $w, $maxH), $fmt)
  $h = [Math]::Min($need.Height, $maxH)
  $brush.Dispose(); $font.Dispose(); $fmt.Dispose()
  return $h
}

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$jpegParams = New-Object System.Drawing.Imaging.EncoderParameters 1
$jpegParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality, [long]84)
function Save-Jpeg($bmp, [string]$path) { $bmp.Save($path, $codec, $jpegParams) }

$photos = @{}
foreach ($k in $types.Keys) { $photos[$k] = [System.Drawing.Image]::FromFile((Join-Path $root "images\$k.jpg")) }

# ---------------------------------------------------------
# One card per type: photo on the left, the result on the right
# ---------------------------------------------------------
function Make-TypeCard([string]$type, [string]$lang) {
  $t = $types[$type]
  $L = if ($lang -eq "ko") { $ko } else { $en }
  $name = if ($lang -eq "ko") { $t.koName } else { $t.enName }
  $tagline = if ($lang -eq "ko") { $t.koTagline } else { $t.enTagline }
  $titleFam = if ($lang -eq "ko") { $famJua } else { $famHenny }
  $nameFam = if ($lang -eq "ko") { $famJua } else { $famBody }
  $bodyFam = if ($lang -eq "ko") { $famKoBody } else { $famBody }
  $bold = [System.Drawing.FontStyle]::Bold
  $regular = [System.Drawing.FontStyle]::Regular
  $italic = if ($lang -eq "ko") { $regular } else { [System.Drawing.FontStyle]::Italic }

  $bmp, $g = New-Canvas

  # Photo with a soft shadow and rounded corners
  $px = 60; $py = 100; $pw = 540; $ph = 405
  $shadow = Rounded-Path ($px + 6) ($py + 12) $pw $ph 28
  $shadowBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(110, 0, 0, 0))
  $g.FillPath($shadowBrush, $shadow); $shadowBrush.Dispose(); $shadow.Dispose()
  $clip = Rounded-Path $px $py $pw $ph 28
  Draw-Cover $g $photos[$type] $px $py $pw $ph $clip
  $clip.Dispose()

  # The words
  $x = 650; $w = 500; $y = 88
  $y += (Draw-Fit $g $L.title $titleFam $regular 50 36 $cream $x $y $w 70) + 22
  $y += (Draw-Fit $g $L.igot $bodyFam $bold 24 20 $leaf $x $y $w 36) + 6
  $nameRegular = if ($lang -eq "ko") { $regular } else { $bold }
  # One line if it fits at 46px or more (so "Will-o'-the-Wisp" never
  # splits at a hyphen); otherwise wrap onto two lines.
  $y += (Draw-Fit $g $name $nameFam $nameRegular 66 46 $sun $x $y $w 160 "near" $true) + 14
  [void](Draw-Fit $g $tagline $bodyFam $italic 27 20 $soft $x $y $w (480 - $y))
  [void](Draw-Fit $g $L.cta $bodyFam $bold 28 22 $sun $x 488 $w 44)

  Save-Jpeg $bmp (Join-Path $imgOut "$type-$lang.jpg")
  $g.Dispose(); $bmp.Dispose()
}

# ---------------------------------------------------------
# The general card, for plain links to the quiz
# ---------------------------------------------------------
function Make-QuizCard([string]$lang) {
  $L = if ($lang -eq "ko") { $ko } else { $en }
  $titleFam = if ($lang -eq "ko") { $famJua } else { $famHenny }
  $bodyFam = if ($lang -eq "ko") { $famKoBody } else { $famBody }
  $italic = if ($lang -eq "ko") { [System.Drawing.FontStyle]::Regular } else { [System.Drawing.FontStyle]::Italic }

  $bmp, $g = New-Canvas
  $y = 70
  $y += (Draw-Fit $g $L.title $titleFam ([System.Drawing.FontStyle]::Regular) 120 80 $cream 60 $y 1080 160 "center") + 6
  [void](Draw-Fit $g $L.subtitle $bodyFam $italic 32 24 $soft 120 $y 960 90 "center")

  # A row of round photos
  $row = @("scout", "wisp", "bard", "camper", "schemer", "mystic", "lookout")
  $d = 124; $gap = 22
  $x0 = ($W - ($row.Count * $d + ($row.Count - 1) * $gap)) / 2
  $ring = New-Object System.Drawing.Pen $sun, 4
  for ($i = 0; $i -lt $row.Count; $i++) {
    $x = $x0 + $i * ($d + $gap); $cy = 372
    $clip = New-Object System.Drawing.Drawing2D.GraphicsPath
    $clip.AddEllipse([float]$x, [float]$cy, [float]$d, [float]$d)
    Draw-Cover $g $photos[$row[$i]] $x $cy $d $d $clip
    $g.DrawEllipse($ring, [float]$x, [float]$cy, [float]$d, [float]$d)
    $clip.Dispose()
  }
  $ring.Dispose()

  Save-Jpeg $bmp (Join-Path $imgOut "quiz-$lang.jpg")
  $g.Dispose(); $bmp.Dispose()
}

# ---------------------------------------------------------
# The tiny pages
# ---------------------------------------------------------
function Enc([string]$s) { return [System.Net.WebUtility]::HtmlEncode($s) }

function Make-SharePage([string]$type, [string]$lang) {
  $t = $types[$type]
  $L = if ($lang -eq "ko") { $ko } else { $en }
  $name = if ($lang -eq "ko") { $t.koName } else { $t.enName }
  $tagline = if ($lang -eq "ko") { $t.koTagline } else { $t.enTagline }
  $title = if ($lang -eq "ko") { $koShare.Replace('${name}', $name) } else { $enShare.Replace('${type}', $name) }
  $desc = "$tagline $($L.desc)"
  $image = "${SiteUrl}share/images/$type-$lang.jpg"
  $file = if ($lang -eq "ko") { "$type-ko.html" } else { "$type.html" }
  $htmlLang = if ($lang -eq "ko") { "ko" } else { "en" }
  $html = @"
<!DOCTYPE html>
<!-- Made by share/make-share-pages.ps1. Don't edit by hand: run the script again. -->
<html lang="$htmlLang">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>$(Enc $title)</title>
  <meta name="description" content="$(Enc $desc)">
  <meta name="robots" content="noindex">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="$(Enc $L.title)">
  <meta property="og:title" content="$(Enc $title)">
  <meta property="og:description" content="$(Enc $desc)">
  <meta property="og:image" content="$image">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="$(Enc "$name - $($L.title)")">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="../favicon.svg" type="image/svg+xml">
  <!-- Send people on to the quiz, keeping ?path=... so they see the result -->
  <script>location.replace("../index.html" + location.search + location.hash);</script>
  <noscript><meta http-equiv="refresh" content="0; url=../index.html"></noscript>
</head>
<body>
  <p><a href="../index.html">$(Enc $L.title)</a></p>
</body>
</html>
"@
  [IO.File]::WriteAllText((Join-Path $here $file), $html, $utf8)
}

foreach ($lang in "en", "ko") {
  Make-QuizCard $lang
  foreach ($type in $types.Keys) {
    Make-TypeCard $type $lang
    Make-SharePage $type $lang
  }
}
foreach ($p in $photos.Values) { $p.Dispose() }

$size = (Get-ChildItem $imgOut -Filter *.jpg | Measure-Object Length -Sum).Sum
"Made {0} preview cards ({1:N0} KB in all) and {2} share pages." -f (Get-ChildItem $imgOut -Filter *.jpg).Count, ($size / 1KB), (Get-ChildItem $here -Filter *.html).Count
