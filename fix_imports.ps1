$files = @(
  "src/components/chapters/ChapterAchievements.tsx",
  "src/components/chapters/ChapterCertifications.tsx",
  "src/components/chapters/ChapterConnect.tsx",
  "src/components/chapters/ChapterJourney.tsx",
  "src/components/chapters/ChapterProjects.tsx",
  "src/components/chapters/ChapterSkills.tsx",
  "src/components/CustomCursor.tsx",
  "src/components/Navigation.tsx",
  "src/components/SoundToggle.tsx",
  "src/components/LoadingScreen.tsx"
)
foreach ($f in $files) {
  $content = Get-Content $f -Raw
  $content = $content -replace "import React, ", "import "
  Set-Content $f $content -NoNewline
  Write-Host "Fixed: $f"
}
