# Fix journal page - wrong column names: share_with_coach and progress

$content = Get-Content "app\portal\journal\page.tsx" -Raw

# Fix 1: remove share_with_coach from select (column doesn't exist)
$content = $content -replace 'select\(''id, entry_type, body, mood_score, created_at, share_with_coach''', "select('id, entry_type, body, mood_score, created_at'"

# Fix 2: remove share_with_coach from interface
$content = $content -replace '\s+share_with_coach: boolean', ''

# Fix 3: remove share_with_coach from insert
$content = $content -replace ', share_with_coach: shareCoach', ''

# Fix 4: fix goals column progress -> progress_pct
$content = $content -replace "select\('id, title, category, target_date, progress'\)", "select('id, title, category, target_date, progress_pct')"

# Fix 5: fix interface progress -> progress_pct
$content = $content -replace '  progress: number', '  progress_pct: number'

# Fix 6: fix all references to g.progress -> g.progress_pct
$content = $content -replace 'g\.progress\b', 'g.progress_pct'

# Fix 7: fix insert progress -> progress_pct
$content = $content -replace 'progress: 0\b', 'progress_pct: 0'

Set-Content -Path "app\portal\journal\page.tsx" -Value $content -Encoding UTF8
Write-Host "OK app\portal\journal\page.tsx" -ForegroundColor Green