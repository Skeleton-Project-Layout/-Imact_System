// ABHISARAN – Question Catalogue & Quiz Setup Service
// Backed by Abhisaran_Master_45_Questions.csv (15 School, 15 Anganwadi, 15 Health/PHC across 5 Layers)
// Supports full interactive CRUD (Check, Change/Edit, Add, Delete, Reset to Master)

import master45 from './master45Questions.json';

export const BASELINE_CORE_QUESTIONS = master45;

const STORAGE_KEY = 'abhisaran_custom_questions';

export const QuestionService = {
  /**
   * Returns all active questions.
   * If local storage has empty, legacy, or incomplete sets (<45), automatically seeds the 45 master questions.
   */
  getAllQuestions() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length >= 45) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored questions from localStorage:', e);
    }
    // Initialize with Master 45 Questions
    this.saveAllQuestions([...BASELINE_CORE_QUESTIONS]);
    return [...BASELINE_CORE_QUESTIONS];
  },

  getQuestionsBySector(sectorId) {
    const all = this.getAllQuestions();
    if (!sectorId || sectorId === 'ALL') return all;
    return all.filter((q) => q.sectorId === sectorId);
  },

  getQuestionsByLayer(sectorId, layer) {
    const sectorQs = this.getQuestionsBySector(sectorId);
    if (!layer || layer === 'ALL') return sectorQs;
    return sectorQs.filter((q) => Number(q.layer) === Number(layer));
  },

  saveAllQuestions(questions) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
      window.dispatchEvent(new CustomEvent('abhisaran_questions_updated', { detail: questions }));
    } catch (e) {
      console.error('Failed to write questions to localStorage:', e);
    }
  },

  addQuestion(newQuestion) {
    const all = this.getAllQuestions();
    const nextNum = all.length > 0 ? Math.max(...all.map((q) => q.questionNumber || 0)) + 1 : 1;
    const formatted = {
      ...newQuestion,
      questionNumber: newQuestion.questionNumber ? Number(newQuestion.questionNumber) : nextNum,
      convergenceQuestion: newQuestion.convergenceQuestion || `Q${nextNum}`,
      layer: Number(newQuestion.layer) || 1,
      optionsJson: typeof newQuestion.optionsJson === 'string'
        ? newQuestion.optionsJson
        : JSON.stringify({ options: newQuestion.options || ['COMPLIANT', 'PARTIAL', 'ABSENT'] })
    };
    all.push(formatted);
    this.saveAllQuestions(all);
    return formatted;
  },

  updateQuestion(questionNumber, updatedFields) {
    const all = this.getAllQuestions();
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
    this.saveAllQuestions(all);
    return all[index];
  },

  deleteQuestion(questionNumber) {
    const all = this.getAllQuestions();
    const filtered = all.filter((q) => q.questionNumber !== Number(questionNumber));
    this.saveAllQuestions(filtered);
    return filtered;
  },

  resetToDefaults() {
    this.saveAllQuestions([...BASELINE_CORE_QUESTIONS]);
    return [...BASELINE_CORE_QUESTIONS];
  }
};
