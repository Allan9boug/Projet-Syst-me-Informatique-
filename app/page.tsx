"use client";



import PeepSelector from "./PeepSelector";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

// Typage des réponses
type Reponse = {
  id: number;
  texte: string;
  rep_correct: boolean;
};

// Typage des questions
type Question = {
  id: number;
  texte: string;
  image_url?: string;
  image_credit_nom?: string;
  image_credit_url?: string;
  explication?: string;
  reponses: Reponse[];
};

// Typage avatar
type Avatar = {
  id: number;
  src: string;
};

export default function Home() {
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [explication, setExplication] = useState("");
  const [afficherExplication, setAfficherExplication] = useState(false);
  
  const avatar = typeof window !== "undefined" ? localStorage.getItem("user_avatar") : null;
  const pseudo = typeof window !== "undefined" ? localStorage.getItem("user_pseudo") : null;

  

  const question = questions[questionIndex];

  // Charger avatar depuis localStorage
  useEffect(() => {
    const savedAvatarId = localStorage.getItem("selectedPeep");
    if (savedAvatarId) {
      setSelectedAvatar({ id: parseInt(savedAvatarId), src: `/peep${savedAvatarId}.svg` });
    }
  }, []);

  // Charger les questions depuis Supabase
  useEffect(() => {
    async function fetchQuestion() {
      const { data, error } = await supabase
        .from("question")
        .select(`
          id,
          texte,
          image_url,
          image_credit_nom,
          image_credit_url,
          explication,
          reponses:reponse (
            id,
            texte,
            rep_correct
          )
        `)
        .order("id", { ascending: true });

      if (error) {
        console.error("Erreur Supabase :", error);
      } else {
        setQuestions(data || []);
      }
    }

    fetchQuestion();
  }, []);

  function handleClick(reponse: Reponse) {
    if (!question || afficherExplication) return;

    const estBonneReponse = reponse.rep_correct;
    const message = estBonneReponse ? "Bonne réponse !" : "Mauvaise réponse.";
    const explicationTexte = question.explication || message;

    setExplication(explicationTexte);

    if (!estBonneReponse) {
      setAfficherExplication(true);
      setTimeout(() => {
        setAfficherExplication(false);
        setExplication("");
      }, 5000);
    } else {
      setQuestionIndex((prev) => prev + 1);
    }
  }

  // Quiz terminé
  if (!question) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-2xl font-bold">Quiz terminé !</h2>
        <p className="mt-4 text-muted-foreground">Merci d’avoir participé.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Sélection de personnage */}
      {!selectedAvatar && (
        <div className="max-w-4xl mx-auto mt-6">
          <PeepSelector onSelect={setSelectedAvatar} />
        </div>
      )}
      
    <div>
      <div style={{ position: "absolute", top: 10, left: 10 }}>
        {avatar && <img src={avatar} width="80" />}
        {pseudo && <p style={{ color: "white" }}>{pseudo}</p>}
      </div>

      {/* Le reste de ton quiz */}
    </div>
  

      {/* Avatar sélectionné affiché en haut à gauche */}
      {selectedAvatar && (
        <div style={{ position: "fixed", top: 20, left: 20, zIndex: 50 }}>
          <img src={selectedAvatar.src} alt="Avatar sélectionné" width={120} />
        </div>
      )}

      {/* Alert de bienvenue */}
      <Alert className="bg-blue-50 border-blue-300 text-blue-800 max-w-xl mx-auto mt-6">
        <AlertTitle className="text-xl font-semibold">Bienvenue sur CyberQuiz</AlertTitle>
        <AlertDescription>
          Un quiz pour tester vos connaissances en cybersécurité.
        </AlertDescription>
      </Alert>

      {/* Quiz */}
      {questions.length > 0 ? (
        <Card className="max-w-4xl mx-auto mt-6">
          <div className="flex">
            {/* Colonne gauche : image + crédit */}
            <div className="w-1/2 p-4">
              {question.image_url ? (
                <Image
                  src={question.image_url}
                  alt="Illustration de la question"
                  width={400}
                  height={300}
                  className="rounded"
                />
              ) : (
                <div className="w-full h-[300px] bg-gray-100 flex items-center justify-center text-sm text-gray-500 rounded">
                  Aucune image disponible
                </div>
              )}

              {question.image_credit_nom && question.image_credit_url && (
                <Alert className="mt-4 text-sm text-muted-foreground">
                  <AlertDescription>
                    <span className="inline">
                      Image :{" "}
                      <Link
                        href={question.image_credit_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2 hover:text-primary"
                      >
                        {question.image_credit_nom}
                      </Link>
                    </span>
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Colonne droite : question + réponses */}
            <div className="w-1/2 p-4">
              <CardHeader className="p-0 mb-4">
                <CardTitle>Question</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-lg font-semibold mb-4">{question.texte}</p>
                {question.reponses.map((reponse: Reponse) => (
                  <Button
                    key={reponse.id}
                    onClick={() => handleClick(reponse)}
                    disabled={afficherExplication}
                    className="w-full justify-start mt-2"
                    variant="outline"
                  >
                    {reponse.texte}
                  </Button>
                ))}
              </CardContent>
              {afficherExplication && (
                <Alert className="mt-6 bg-yellow-50 border-yellow-300 text-yellow-800">
                  <AlertTitle>Explication</AlertTitle>
                  <AlertDescription>{explication}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </Card>
      ) : (
        <p className="text-center mt-6">Chargement des questions...</p>
      )}
    </div>
  );
}
