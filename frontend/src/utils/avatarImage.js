/**
 * Avatar image cookie helpers.
 * Persist a small data URL preview in a cookie under ~3.5KB.
 * @module avatarImage
 */

/** Cookie name used for the avatar preview. */
const COOKIE_NAME = 'avatar_preview_v1'
/** Maximum size of the stored data URL, in bytes. */
const MAX_BYTES = 3500

/**
 * Read the avatar image data URL from cookies.
 * @returns {string|null}
 */
export function getAvatarImageCookie() {
  if (typeof document === 'undefined') return null
  const match = document.cookie.split('; ').find(r => r.startsWith(COOKIE_NAME+'='))
  if (!match) return null
  try {
    const val = decodeURIComponent(match.split('=')[1])
    return val || null
  } catch { return null }
}

/**
 * Persist the avatar data URL in a cookie (if under size limit).
 * @param {string} dataUrl
 */
export function setAvatarImageCookie(dataUrl) {
  if (typeof document === 'undefined') return
  if (!dataUrl) return clearAvatarImageCookie()
  // Only store if under limit
  if (new Blob([dataUrl]).size > MAX_BYTES) return // silently skip if too large
  const expires = new Date(Date.now() + 1000*60*60*24*30).toUTCString() // 30 days
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(dataUrl)}; expires=${expires}; path=/; SameSite=Lax`
}

/**
 * Remove the avatar cookie.
 */
export function clearAvatarImageCookie() {
  if (typeof document === 'undefined') return
  document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`
}

/**
 * Downscale an image file and return a data URL (webp preferred, png fallback).
 * Returns null if the final data URL is too large.
 * @param {File} file
 * @param {number} [size=96] Maximum bounding box size.
 * @returns {Promise<string|null>}
 */
export async function downscaleToDataUrl(file, size = 96) {
  if (!file) return null
  const img = await new Promise((res, rej) => {
    const fr = new FileReader()
    fr.onerror = () => rej(new Error('read fail'))
    fr.onload = () => {
      const i = new Image()
      i.onload = () => res(i)
      i.onerror = () => rej(new Error('img load fail'))
      i.src = fr.result
    }
    fr.readAsDataURL(file)
  })
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const ratio = img.width > img.height ? size / img.width : size / img.height
  canvas.width = Math.round(img.width * ratio)
  canvas.height = Math.round(img.height * ratio)
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  // Try webp first then fallback png
  let dataUrl = canvas.toDataURL('image/webp', 0.8)
  if (new Blob([dataUrl]).size > MAX_BYTES) {
    dataUrl = canvas.toDataURL('image/png')
  }
  // Final size check
  if (new Blob([dataUrl]).size > MAX_BYTES) return null
  return dataUrl
}
