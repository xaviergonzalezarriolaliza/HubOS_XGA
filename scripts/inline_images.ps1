$mdPath = 'HubOS_QA_Engineer_Homework_XGA.md'
$out = 'docs/HubOS_QA_Engineer_Homework_XGA.inlined.md'
$text = Get-Content -Raw $mdPath -Encoding UTF8
$replacements = @{
  'playwright-report/data/c5a63091c84b46ac0df67e5b9cd13bd081a278cf.png' = '.tmp\\img1.b64'
  'playwright-report/data/f71ae65d482fdffd1dc770e298eb252e47724077.png' = '.tmp\\img2.b64'
  'playwright-report/data/d4083499a387fbf4e904d9103fbdfa3ab50f0893.png' = '.tmp\\img3.b64'
  'playwright-report/data/5648a809cbe47e8152ff710b5d2be53526405761.png' = '.tmp\\img4.b64'
  'playwright-report/data/cc5631e724eb8330d3fc69573f66b77a6040ff8c.png' = '.tmp\\img5.b64'
}
foreach ($k in $replacements.Keys) {
  $b64path = $replacements[$k]
  if (Test-Path $b64path) {
    $b = [IO.File]::ReadAllText($b64path)
    $uri = 'data:image/png;base64,' + $b
    $escaped = [regex]::Escape('(' + $k + ')')
    $text = [regex]::Replace($text, $escaped, $uri)
  } else {
    Write-Host "WARN: missing base64 for $k -> $b64path"
  }
}
Set-Content -Path $out -Value $text -Encoding UTF8
Write-Host "WROTE: $out"