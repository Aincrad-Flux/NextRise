// Utility to persist a small avatar preview in a cookie.
// We store a compressed (resized) data URL (png) limited in size.
// Cookie limits ~4KB per cookie; we'll target <3.5KB.

const COOKIE_NAME = 'avatar_preview_v1'
const MAX_BYTES = 3500

export function getAvatarImageCookie() {
  if (typeof document === 'undefined') return null
  const match = document.cookie.split('; ').find(r => r.startsWith(COOKIE_NAME+'='))
  if (!match) return null
  try {
    const val = decodeURIComponent(match.split('=')[1])
    return val || null
  } catch { return null }
}

export function setAvatarImageCookie(dataUrl) {
  if (typeof document === 'undefined') return
  if (!dataUrl) return clearAvatarImageCookie()
  // Only store if under limit
  if (new Blob([dataUrl]).size > MAX_BYTES) return // silently skip if too large
  const expires = new Date(Date.now() + 1000*60*60*24*30).toUTCString() // 30 days
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(dataUrl)}; expires=${expires}; path=/; SameSite=Lax`
}

export function clearAvatarImageCookie() {
  if (typeof document === 'undefined') return
  document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`
}

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
