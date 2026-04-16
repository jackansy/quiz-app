"use client";

import { useState } from "react";
import { questions } from "./data/questions";

type Question = {
  question: string;
  options: string[];
  answer: string[];
  type: "single" | "multiple";
};

type WeekType = keyof typeof questions | "all";

export default function Home() {
  const [selectedWeek, setSelectedWeek] = useState<WeekType>("week1");
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [shuffle, setShuffle] = useState(false);

  const getQuestions = (): Question[] => {
    let qs =
      selectedWeek === "all"
        ? Object.values(questions).flat()
        : questions[selectedWeek];

    if (shuffle) {
      qs = [...qs].sort(() => Math.random() - 0.5);
    }

    return qs as Question[];
  };

  const quizQuestions = getQuestions();
  const currentQ = quizQuestions[currentIndex];

  const handleAnswer = (opt: string) => {
  if (currentQ.type === "multiple") {
    setSelectedOptions((prev) =>
      prev.includes(opt)
        ? prev.filter((o) => o !== opt)
        : [...prev, opt]
    );
  } else {
    setSelectedOptions([opt]);
  }
};

 const handleSubmit = () => {
  const correct = [...currentQ.answer].sort().join(",");
  const selected = [...selectedOptions].sort().join(",");

  if (correct === selected) {
    setScore((prev) => prev + 1);
  }

  if (currentIndex + 1 < quizQuestions.length) {
    setCurrentIndex((prev) => prev + 1);
    setSelectedOptions([]);
  } else {
    setQuizFinished(true);
  }
};

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizFinished(false);
    setCurrentIndex(0);
    setSelectedOptions([]);
    setScore(0);
  };

  if (!quizStarted) {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Quiz App</h1>

        <select
          className="border p-2 mb-4 w-full"
          onChange={(e) =>
            setSelectedWeek(e.target.value as WeekType)
          }
        >
          <option value="week1">Week 1</option>
          <option value="week2">Week 2</option>
          <option value="week3">Week 3</option>
          <option value="week4">Week 4</option>
          <option value="week5">Week 5</option>
          <option value="week6">Week 6</option>
          <option value="week7">Week 7</option>
          <option value="week8">Week 8</option>
          <option value="week9">Week 9</option>
          <option value="week10">Week 10</option>
          <option value="week11">Week 11</option>
          <option value="week12">Week 12</option>
          <option value="all">All Weeks</option>
        </select>

        <label className="block mb-4">
          <input
            type="checkbox"
            onChange={() => setShuffle(!shuffle)}
          />{" "}
          Shuffle Questions
        </label>

        <button
          className="bg-blue-500 text-white px-4 py-2"
          onClick={() => setQuizStarted(true)}
        >
          Start Quiz
        </button>
      </div>
    );
  }

  if (quizFinished) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold">Quiz Finished</h2>
        <p className="mt-2">
          Score: {score} / {quizQuestions.length}
        </p>

        <button
          className="mt-4 bg-green-500 text-white px-4 py-2"
          onClick={resetQuiz}
        >
          Restart
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-lg font-semibold mb-4">
        Q{currentIndex + 1}. {currentQ.question}
      </h2>

      {currentQ.type === "multiple" && (
        <p className="text-sm text-gray-500 mb-2">
          Select multiple options
        </p>
      )}

      {currentQ.options.map((opt, i) => (
        <button
          key={i}
          onClick={() => handleAnswer(opt)}
          className={`block w-full border p-2 mb-2 text-left ${
            selectedOptions.includes(opt)
              ? "bg-blue-200"
              : ""
          }`}
        >
          {opt}
        </button>
      ))}

      <button
        className="mt-4 bg-purple-500 text-white px-4 py-2"
        onClick={handleSubmit}
        disabled={selectedOptions.length === 0}
      >
        Submit
      </button>
    </div>
  );
}