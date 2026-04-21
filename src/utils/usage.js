// Freemium usage tracking via localStorage
// TODO(phase-auth): replace with server-side tracking once auth is added

const STORAGE_KEY = 'suppsupps_usage'
const FREE_LIMIT = 5

function getTodayKey() {
  return new Date().toISOString().slice(0, 10) // "YYYY-MM-DD"
}

function getUsageData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { date: getTodayKey(), count: 0 }
    const data = JSON.parse(raw)
    // Reset count if it's a new day
    if (data.date !== getTodayKey()) return { date: getTodayKey(), count: 0 }
    return data
  } catch {
    return { date: getTodayKey(), count: 0 }
  }
}

function saveUsageData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function getSearchCount() {
  return getUsageData().count
}

export function getRemainingSearches() {
  return Math.max(0, FREE_LIMIT - getUsageData().count)
}

export function canSearch() {
  return getUsageData().count < FREE_LIMIT
}

export function incrementSearchCount() {
  const data = getUsageData()
  data.count += 1
  saveUsageData(data)
  return data.count
}

export { FREE_LIMIT }
