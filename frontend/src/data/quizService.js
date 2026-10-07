// ABHISARAN – Field Reference Form & Quiz Setup Service
// Backed by Abhisaran_Master_45_Questions.csv (15 School, 15 Anganwadi, 15 Health/PHC across 5 evaluation layers)
// Used for the ABHISARAN Field Reference Survey (Q1–Q67) and Quiz Setup

import master45 from './master45Questions.json';

export const MASTER_45_QUIZ_QUESTIONS = master45;

const QUIZ_STORAGE_KEY = 'abhisaran_quiz_questions';

export const QuizService = {
  /**
   * Returns all active quiz questions for the Field Reference Form / Quiz Setup.
   * Defaults to the Master 45 questions seeded from Abhisaran_Master_45_Questions.csv.
   */
  getAllQuizQuestions() {
    try {
      const stored = localStorage.getItem(QUIZ_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse quiz questions from localStorage:', e);
    }
    this.saveAllQuizQuestions([...MASTER_45_QUIZ_QUESTIONS]);
    return [...MASTER_45_QUIZ_QUESTIONS];
  },

  getQuizQuestionsBySector(sectorId) {
    const all = this.getAllQuizQuestions();
    if (!sectorId || sectorId === 'ALL') return all;
    return all.filter((q) => q.sectorId === sectorId);
  },

  getQuizQuestionsByLayer(sectorId, layer) {
    const sectorQs = this.getQuizQuestionsBySector(sectorId);
    if (!layer || layer === 'ALL') return sectorQs;
    return sectorQs.filter((q) => Number(q.layer) === Number(layer));
  },

  saveAllQuizQuestions(questions) {
    try {
      localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(questions));
      window.dispatchEvent(new CustomEvent('abhisaran_quiz_questions_updated', { detail: questions }));
    } catch (e) {
      console.error('Failed to write quiz questions to localStorage:', e);
    }
  },

  addQuizQuestion(newQuestion) {
    const all = this.getAllQuizQuestions();
    const nextNum = all.length > 0 ? Math.max(...all.map((q) => q.questionNumber || 0)) + 1 : 1;
    const formatted = {
      ...newQuestion,
      questionNumber: newQuestion.questionNumber ? Number(newQuestion.questionNumber) : nextNum,
      convergenceQuestion: newQuestion.convergenceQuestion || `Q${nextNum}`,
      layer: Number(newQuestion.layer) || 1,
      optionsJson: typeof newQuestion.optionsJson === 'string'
        ? newQuestion.optionsJson
        : JSON.stringify({ options: newQuestion.options || ['COMPLIANT_AND_VERIFIED', 'PARTIAL_GAPS', 'NON_COMPLIANT_ABSENT'] })
    };
    all.push(formatted);
    this.saveAllQuizQuestions(all);
    return formatted;
  },

  updateQuizQuestion(questionNumber, updatedFields) {
    const all = this.getAllQuizQuestions();
    const index = all.findIndex((q) => q.questionNumber === Number(questionNumber));
    if (index === -1) return null;

    const current = all[index];
    all[index] = {
      ...current,
      ...updatedFields,
      questionNumber: Number(questionNumber),
      layer: updatedFields.layer !== undefined ? Number(updatedFields.layer) : current.layer,
      optionsJson: typeof updatedFields.optionsJson === 'string'
        ? updatedFields.optionsJson
        : (updatedFields.options
          ? JSON.stringify({ options: updatedFields.options })
          : current.optionsJson)
    };
    this.saveAllQuizQuestions(all);
    return all[index];
  },

  deleteQuizQuestion(questionNumber) {
    const all = this.getAllQuizQuestions();
    const filtered = all.filter((q) => q.questionNumber !== Number(questionNumber));
    this.saveAllQuizQuestions(filtered);
    return filtered;
  },

  resetQuizQuestions() {
    this.saveAllQuizQuestions([...MASTER_45_QUIZ_QUESTIONS]);
    return [...MASTER_45_QUIZ_QUESTIONS];
  }
};
