"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const avatars = [
  "/avatars/peep-1.svg",
  "/avatars/peep-2.svg",
  "/avatars/peep-3.svg",
  "/avatars/peep-4.svg",
  "/avatars/peep-5.svg",
  "/avatars/peep-6.svg",
  "/avatars/peep-7.svg",
  "/avatars/peep-8.svg",
  "/avatars/peep-9.svg",
  "/avatars/peep-10.svg",
];

export default function SelectCharacter() {
  const [selectedAvatar, setSelectedAvatar] =  useState<string | null>(null);
  const [pseudo, setPseudo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!pseudo || !selectedAvatar) {
      alert("Choisis un avatar et entre ton pseudo !");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("users").insert({
      pseudo: pseudo,
      avatar: selectedAvatar,
    });

    if (error) {
      console.error(error);
      alert("Erreur lors de l'enregistrement.");
    } else {
      localStorage.setItem("user_pseudo", pseudo);
      localStorage.setItem("user_avatar", selectedAvatar);

      window.location.href = "/quiz";
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "30px", color: "white" }}>
      <h1>Choisis ton personnage</h1>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
        {avatars.map((av, i) => (
          <div
            key={i}
            onClick={() => setSelectedAvatar(av)}
            style={{
              border: selectedAvatar === av ? "3px solid yellow" : "2px solid gray",
              padding: "10px",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            <img src={av} width="90" />
          </div>
        ))}
      </div>

      <h2>Ton pseudo :</h2>
      <input
        type="text"
        value={pseudo}
        onChange={(e) => setPseudo(e.target.value)}
        placeholder="Entre ton pseudo"
        style={{
          padding: "8px",
          borderRadius: "5px",
          border: "none",
          marginBottom: "15px",
          color: "black",
        }}
      />

      <br />

      <button
        onClick={handleSave}
        disabled={loading}
        style={{
          padding: "10px 20px",
          backgroundColor: "blue",
          color: "white",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {loading ? "Enregistrement..." : "Valider"}
      </button>
    </div>
  );
}
