import { useEffect, useRef, useState } from 'react'
import { getAvatarImageCookie, setAvatarImageCookie, clearAvatarImageCookie, downscaleToDataUrl } from '../utils/avatarImage.js'
import UserCard from './UserCard'
import './AvatarMenu.css'

/* AvatarMenu
 * - Fetches user info (or relies on UserCard which fetches /api/auth/me)
 * - Shows a popover with full user info and local avatar image preview (not uploaded)
 * - Allows picking an image (stored only in memory/local preview, not sent to backend)
 */
export default function AvatarMenu() {
  const [open, setOpen] = useState(false)
  const [preview, setPreview] = useState(() => getAvatarImageCookie() || null) // data URL of selected image
  const btnRef = useRef(null)
  const popRef = useRef(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function onClick(e) {
      if (!popRef.current || !btnRef.current) return
      if (popRef.current.contains(e.target) || btnRef.current.contains(e.target)) return
      setOpen(false)
    }
    function onKey(e) { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('mousedown', onClick)
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('mousedown', onClick); window.removeEventListener('keydown', onKey) }
  }, [open])

  // Manage focus return
  useEffect(() => {
    if (!open && btnRef.current) {
      btnRef.current.focus({ preventScroll: true })
    }
  }, [open])

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const scaled = await downscaleToDataUrl(file, 96)
      if (scaled) {
        setPreview(scaled)
        setAvatarImageCookie(scaled)
        window.dispatchEvent(new CustomEvent('avatar-updated', { detail: { image: scaled } }))
      }
    } catch (err) {
      console.error('avatar scale error', err)
    }
  }

  const clearImage = () => {
    setPreview(null)
    clearAvatarImageCookie()
    window.dispatchEvent(new CustomEvent('avatar-updated', { detail: { image: null } }))
  }

  return (
    <div className="avatar-menu-wrapper">
      <button
        ref={btnRef}
        type="button"
        className="avatar-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
      >
        {preview ? (
          <img src={preview} alt="Avatar local" className="avatar-img" />
        ) : (
          <div className="avatar placeholder" aria-hidden="true" />
        )}
        <span className="sr-only">Ouvrir le profil</span>
      </button>
      {open && (
        <div ref={popRef} className="avatar-popover" role="dialog" aria-label="Menu utilisateur">
          <UserCard avatarImage={preview} />
          <div className="avatar-pop-divider" />
          <div className="avatar-upload-block">
            <label className="upload-label">
              <input type="file" accept="image/*" onChange={handleFile} hidden />
              <span>Changer l'image (local)</span>
            </label>
            {preview && (
              <button type="button" className="clear-btn" onClick={clearImage}>Retirer</button>
            )}
          </div>
          <div className="avatar-hint">L'image n'est pas envoyée au serveur.</div>
        </div>
      )}
    </div>
  )
}
