"use client";
type WeekType = keyof typeof questions | "all";

import { useState, useEffect } from "react";
import { questions } from "./data/questions";

export default function Home() {
  const [selectedWeek, setSelectedWeek] = useState<WeekType>("week1");
  const [quizStarted, setQuizStarted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);
  const [quizFinished, setQuizFinished] = useState(false);

  const getQuestions = () => {
  if (selectedWeek === "all") {
    return Object.values(questions).flat();
  }

  return questions[selectedWeek as keyof typeof questions];
};

  const quizQuestions = getQuestions();
  const currentQ = quizQuestions[currentIndex];

  useEffect(() => {
    if (!quizStarted || quizFinished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setQuizFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, quizFinished]);

  const handleAnswer = (opt: string) => {
    setSelectedOption(opt);
    if (opt === currentQ.answer) {
      setScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < quizQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setQuizFinished(true);
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      {!quizStarted ? (
        <>
          <h1 className="text-2xl font-bold mb-4">Practice Quiz</h1>

          <select
            className="border p-2 mb-4 w-full"
            onChange={(e) => setSelectedWeek(e.target.value as WeekType)}
          >
            <option value="week1">Week 1</option>
            <option value="week2">Week 2</option>
            <option value="all">All Weeks</option>
          </select>

          <label className="flex gap-2 mb-4">
            <input
              type="checkbox"
              onChange={(e) => setShuffle(e.target.checked)}
            />
            Shuffle Questions
          </label>

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => setQuizStarted(true)}
          >
            Start Quiz
          </button>
        </>
      ) : quizFinished ? (
        <>
          <h2 className="text-xl font-bold mb-4">Quiz Finished 🎉</h2>
          <p>Score: {score} / {quizQuestions.length}</p>
          <p>Time Left: {formatTime(timeLeft)}</p>
          <button
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
            onClick={() => window.location.reload()}
          >
            Restart
          </button>
        </>
      ) : (
        <>
          <div className="flex justify-between mb-4">
            <span>
              Q{currentIndex + 1}/{quizQuestions.length}
            </span>
            <span>⏱️ {formatTime(timeLeft)}</span>
          </div>

          <h2 className="mb-4">{currentQ.question}</h2>

          {currentQ.options.map((opt: string, i: number) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              className={`block w-full border p-2 mb-2 ${
                selectedOption === opt
                  ? opt === currentQ.answer
                    ? "bg-green-300"
                    : "bg-red-300"
                  : ""
              }`}
            >
              {opt}
            </button>
          ))}

          <button
            onClick={nextQuestion}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Next
          </button>
        </>
      )}
    </div>
  );
}
