"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Profil() {
  const router = useRouter();

  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
  const [pseudo, setPseudo] = useState("");
  const [error, setError] = useState("");

  const avatars = Array.from({ length: 10 }, (_, i) => i + 1);

  async function handleSubmit() {
    if (!selectedAvatar) {
      return setError("Choisis un avatar !");
    }
    if (pseudo.trim().length < 3) {
      return setError("Le pseudo doit faire au moins 3 caractères.");
    }

    // Enregistrer dans Supabase
    const { error } = await supabase.from("utilisateurs").insert({
      pseudo: pseudo,
      avatar: selectedAvatar,
    });

    if (error) {
      console.error(error);
      return setError("Erreur pendant l’enregistrement.");
    }

    // Sauvegarde locale pour affichage
    localStorage.setItem("selectedPeep", selectedAvatar.toString());
    localStorage.setItem("pseudo", pseudo);

    // Redirection → quiz
    router.push("/");
  }

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Créer ton profil</h1>

      <Card className="p-6">
        <h2 className="text-xl mb-4 font-semibold">Choisis ton avatar :</h2>

        <div className="grid grid-cols-5 gap-4 mb-6">
          {avatars.map((num) => (
            <div
              key={num}
              className={`p-2 rounded-xl border cursor-pointer transition ${
                selectedAvatar === num
                  ? "border-blue-500 shadow-lg"
                  : "border-gray-700"
              }`}
              onClick={() => setSelectedAvatar(num)}
            >
              <Image
                src={`/peep${num}.svg`}
                alt={`Avatar ${num}`}
                width={100}
                height={100}
              />
            </div>
          ))}
        </div>

        <h2 className="text-xl font-semibold mb-2">Ton pseudo :</h2>
        <input
          type="text"
          className="border p-2 rounded w-full bg-black/20 text-white"
          placeholder="Ex : CyberWarrior"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
        />

        {error && <p className="text-red-500 mt-3">{error}</p>}

        <Button
          className="w-full mt-6"
          variant="default"
          onClick={handleSubmit}
        >
          Valider
        </Button>
      </Card>
    </div>
  );
}
