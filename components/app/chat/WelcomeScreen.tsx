"use client";

import { Dumbbell, Calendar, MapPin, Lightbulb } from "lucide-react";

interface SuggestionProps {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
}

function Suggestion({ icon, text, onClick }: SuggestionProps) {
  return (
    <button type="button" onClick={onClick}>
      <div>{icon}</div>
      <span>{text}</span>
    </button>
  );
}

interface WelcomeScreenProps {
  onSuggestionClick: (message: { text: string }) => void;
  isSignedIn: boolean;
}

export function WelcomeScreen({
  onSuggestionClick,
  isSignedIn,
}: WelcomeScreenProps) {
  const suggestions = [
    {
      icon: <Dumbbell className="h-4 w-4 text-primary" />,
      text: "What yoga classes do you have?",
    },
    {
      icon: <Calendar className="h-4 w-4 text-primary" />,
      text: "What are my upcoming bookings?",
      requiresAuth: true,
    },
    {
      icon: <Lightbulb className="h-4 w-4 text-primary" />,
      text: "Recommend classes for weight loss",
    },
    {
      icon: <MapPin className="h-4 w-4 text-primary" />,
      text: "Find studios near me",
    },
  ];

  const filteredSuggestions = suggestions.filter(
    (s) => !s.requiresAuth || isSignedIn,
  );

  return (
    <div>
      <div>
        <Dumbbell className="h-8 w-8 text-primary" />
      </div>

      <h2>Fitness Assistant</h2>
      <p>
        I can help you find classes, check bookings, and get personalized
        recommendations.
      </p>

      <div>
        <p>Try asking:</p>
        {filteredSuggestions.map((suggestion) => (
          <Suggestion
            key={suggestion.text}
            icon={suggestion.icon}
            text={suggestion.text}
            onClick={() => onSuggestionClick({ text: suggestion.text })}
          />
        ))}
      </div>
    </div>
  );
}
