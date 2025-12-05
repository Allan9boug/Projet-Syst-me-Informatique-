"use client"; // nécessaire si tu es dans Next.js 13+ avec app directory
import { useState, useEffect } from "react";

// Tableau des avatars OpenPeeps (fichiers SVG à mettre dans /public)
const avatars = [
  { id: 1, src: "/avatars/peep-1.svg", color: "#FF6B6B" },
  { id: 2, src: "/avatars/peep-2.svg", color: "#4ECDC4" },
  { id: 3, src: "/avatars/peep-3.svg", color: "#FFD93D" },
  { id: 4, src: "/avatars/peep-4.svg", color: "#1A535C" },
  { id: 5, src: "/avatars/peep-5.svg", color: "#FF9F1C" },
  { id: 6, src: "/avatars/peep-6.svg", color: "#2EC4B6" },
  { id: 7, src: "/avatars/peep-7.svg", color: "#E71D36" },
  { id: 8, src: "/avatars/peep-8.svg", color: "#4A4C93" },
  { id: 9, src: "/avatars/peep-9.svg", color: "#7F2SB9" },
  { id: 10, src: "/avatars/peep-10.svg", color: "#3A86FF" },
];


export default function PeepSelector({ onSelect }) {
  const [selectedId, setSelectedId] = useState(null);

  // Charger la sélection précédente depuis localStorage
  useEffect(() => {
    const saved = localStorage.getItem("selectedPeep");
    if (saved) setSelectedId(parseInt(saved));
  }, []);

  const handleSelect = (avatar) => {
    setSelectedId(avatar.id);
    localStorage.setItem("selectedPeep", avatar.id);
    if (onSelect) onSelect(avatar); // pour transmettre le choix au quiz
  };

  return (
    <div>
      <h2>Choisis ton personnage :</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {avatars.map((avatar) => (
          <div
            key={avatar.id}
            onClick={() => handleSelect(avatar)}
            style={{
              border: selectedId === avatar.id ? "3px solid #000" : "2px solid #ccc",
              borderRadius: "10px",
              padding: "5px",
              cursor: "pointer",
              backgroundColor: avatar.color,
              width: "100px",
              height: "100px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img src={avatar.src} alt={`Avatar ${avatar.id}`} width="80" />
          </div>
        ))}
      </div>
    </div>
  );
}
