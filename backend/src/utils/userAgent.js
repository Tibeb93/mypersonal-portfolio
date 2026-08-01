// Lightweight user-agent parser — no external dependencies
// Extracts browser, OS, device type from UA string

const BROWSERS = [
  [/Edg\/([\d.]+)/, 'Edge'],
  [/OPR\/([\d.]+)/, 'Opera'],
  [/Chrome\/([\d.]+)/, 'Chrome'],
  [/Firefox\/([\d.]+)/, 'Firefox'],
  [/Safari\/([\d.]+)/, 'Safari'],
  [/MSIE\s([\d.]+)/, 'IE'],
  [/Trident.*rv:([\d.]+)/, 'IE'],
]

const OS_LIST = [
  [/Windows NT 10\.0/, 'Windows 10/11'],
  [/Windows NT 6\.3/, 'Windows 8.1'],
  [/Windows NT 6\.2/, 'Windows 8'],
  [/Windows NT 6\.1/, 'Windows 7'],
  [/Windows/, 'Windows'],
  [/Mac OS X ([\d_]+)/, 'macOS'],
  [/Android\s([\d.]+)/, 'Android'],
  [/Linux/, 'Linux'],
  [/iPhone OS ([\d_]+)/, 'iOS'],
  [/iPad.*OS ([\d_]+)/, 'iPadOS'],
]

const DEVICES = [
  [/Mobile|Android|iPhone|iPad|iPod/i, 'Mobile'],
  [/Windows|Mac OS X|Linux/i, 'Desktop'],
]

/**
 * Parse user-agent string into structured info
 * @param {string} ua - raw user-agent header
 * @returns {{ browser: string, browserVersion: string, os: string, device: string }}
 */
export function parseUserAgent(ua) {
  if (!ua) return { browser: 'Unknown', browserVersion: '', os: 'Unknown', device: 'Unknown' }

  let browser = 'Other'
  let browserVersion = ''
  for (const [regex, name] of BROWSERS) {
    const match = ua.match(regex)
    if (match) {
      browser = name
      browserVersion = match[1]?.split('.')[0] || ''
      break
    }
  }

  let os = 'Other'
  for (const [regex, name] of OS_LIST) {
    if (regex.test(ua)) {
      os = name
      break
    }
  }

  let device = 'Desktop'
  for (const [regex, name] of DEVICES) {
    if (regex.test(ua)) {
      device = name
      break
    }
  }

  return { browser, browserVersion, os, device }
}

/**
 * Extract referrer domain from a full referrer URL
 * @param {string} referrer
 * @returns {string|null}
 */
export function extractReferrerDomain(referrer) {
  if (!referrer) return null
  try {
    return new URL(referrer).hostname
  } catch {
    return referrer
  }
}
