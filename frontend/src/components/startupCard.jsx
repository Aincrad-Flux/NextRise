import { useState, useRef, useEffect } from "react";

export default function StartupCard({ project, onEdit, onDelete, onSelect }) {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  // Fermer le menu si clic à l'extérieur
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    }

    if (openMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenu]);

  return (
    <article
      key={project.id || project.name}
      onClick={() => onSelect(project)}
      className="startup-card"
      style={{ position: "relative" }}
    >
      {/* Menu trois points */}
      <div
        ref={menuRef}
        style={{
          position: "absolute",
          top: "0.5rem",
          right: "0.8rem",
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpenMenu((prev) => !prev);
          }}
          style={{
            background: "transparent",
            width: "30px",
            height: "30px",
            border: "none",
            cursor: "pointer",
            fontSize: "1.2rem",
            color: "white",
          }}
        >
          ⋮
        </button>

        {openMenu && (
          <div
            style={{
              position: "absolute",
              top: "1.5rem",
              right: "0",
              background: "white",
              border: "1px solid #ddd",
              borderRadius: "6px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              zIndex: 10,
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenu(false);
                onEdit(project);
              }}
              style={{
                display: "block",
                width: "100%",
                padding: "0.5rem 1rem",
                border: "none",
                background: "white",
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              Éditer
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenu(false);
                onDelete(project);
              }}
              style={{
                display: "block",
                width: "100%",
                padding: "0.5rem 1rem",
                border: "none",
                background: "white",
                textAlign: "left",
                cursor: "pointer",
                color: "red",
              }}
            >
              Supprimer
            </button>
          </div>
        )}
      </div>

      {/* Contenu carte */}
      <h2>{project.name}</h2>
      <div className="description">
        <p>{project.description?.trim() || "Aucune description."}</p>
        <button
          className="read-more-btn"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(project);
          }}
        >
          Details
        </button>
      </div>
    </article>
  );
}
