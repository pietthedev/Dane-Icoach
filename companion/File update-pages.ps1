Write-Host "Fixing journal, bookings and homework pages..." -ForegroundColor Cyan

# =============================================================================
# 1. Fix journal page
# - share_with_coach does not exist in journal_entries
# - progress -> progress_pct in goals
# =============================================================================
$journal = Get-Content "app\portal\journal\page.tsx" -Raw
$journal = $journal -replace 'id, entry_type, body, mood_score, created_at, share_with_coach', 'id, entry_type, body, mood_score, created_at'
$journal = $journal -replace '  share_with_coach: boolean\r?\n', ''
$journal = $journal -replace ', share_with_coach: shareCoach', ''
$journal = $journal -replace "'id, title, category, target_date, progress'", "'id, title, category, target_date, progress_pct'"
$journal = $journal -replace '  progress: number', '  progress_pct: number'
$journal = $journal -replace 'g\.progress\b', 'g.progress_pct'
$journal = $journal -replace ', progress: 0', ', progress_pct: 0'
Set-Content "app\portal\journal\page.tsx" -Value $journal -Encoding UTF8
Write-Host "OK app\portal\journal\page.tsx" -ForegroundColor Green

# =============================================================================
# 2. Fix bookings page
# - session_type does not exist -> use title
# =============================================================================
$bookings = Get-Content "app\portal\bookings\page.tsx" -Raw
$bookings = $bookings -replace 'session_type: string \| null', 'title: string | null'
$bookings = $bookings -replace 'id, scheduled_at, session_type, status, meeting_url, pre_session_notes', 'id, scheduled_at, title, status, meeting_url, pre_session_notes'
$bookings = $bookings -replace 'id, scheduled_at, session_type, status, meeting_url', 'id, scheduled_at, title, status, meeting_url'
$bookings = $bookings -replace 'b\.session_type', 'b.title'
Set-Content "app\portal\bookings\page.tsx" -Value $bookings -Encoding UTF8
Write-Host "OK app\portal\bookings\page.tsx" -ForegroundColor Green

# =============================================================================
# 3. Fix homework page
# - feedback -> coach_feedback
# - feedback_at -> coach_feedback_at
# - resources is jsonb not string[] 
# - submitted/completed -> reviewed
# =============================================================================
$homework = Get-Content "app\portal\homework\page.tsx" -Raw
$homework = $homework -replace 'feedback: string \| null', 'coach_feedback: string | null'
$homework = $homework -replace 'feedback_at: string \| null', 'coach_feedback_at: string | null'
$homework = $homework -replace 'id, title, instructions, due_date, status, resources, feedback, feedback_at', 'id, title, description, due_date, status, coach_feedback, coach_feedback_at'
$homework = $homework -replace "h\.status === 'submitted' \|\| h\.status === 'completed'", "h.status === 'submitted' || h.status === 'reviewed'"
$homework = $homework -replace 'h\.feedback\b', 'h.coach_feedback'
$homework = $homework -replace 'h\.feedback_at\b', 'h.coach_feedback_at'
$homework = $homework -replace 'h\.instructions\b', 'h.description'
$homework = $homework -replace 'resources: string\[\] \| null', 'description: string | null'
# Remove resources block since it's jsonb and complex
$homework = $homework -replace '(?s)\{h\.resources && h\.resources\.length > 0 && \(.*?\)\}', ''
Set-Content "app\portal\homework\page.tsx" -Value $homework -Encoding UTF8
Write-Host "OK app\portal\homework\page.tsx" -ForegroundColor Green

Write-Host ""
Write-Host "All done! Restart npm run dev" -ForegroundColor Cyan