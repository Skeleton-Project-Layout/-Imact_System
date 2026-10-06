/**
 * OfflineQueueService.js
 * Manages localStorage queue for field observations taken in offline/poor connectivity conditions.
 */

const STORAGE_KEY = 'abhisaran_offline_draft_queue';

export const OfflineQueueService = {
  getPendingDrafts() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error('Failed to read offline queue from localStorage:', err);
      return [];
    }
  },

  enqueueDraft(observation) {
    try {
      const drafts = this.getPendingDrafts();
      const draftWithMeta = {
        ...observation,
        queueId: 'draft_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9),
        queuedAt: new Date().toISOString()
      };
      drafts.push(draftWithMeta);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
      return draftWithMeta;
    } catch (err) {
      console.error('Failed to enqueue offline draft:', err);
      return null;
    }
  },

  removeDraft(queueId) {
    try {
      const drafts = this.getPendingDrafts().filter((d) => d.queueId !== queueId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
      return drafts;
    } catch (err) {
      console.error('Failed to remove draft from offline queue:', err);
      return [];
    }
  },

  clearQueue() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error('Failed to clear offline queue:', err);
    }
  },

  getQueueCount() {
    return this.getPendingDrafts().length;
  },

  async syncDrafts(apiSubmitFn) {
    const drafts = this.getPendingDrafts();
    if (drafts.length === 0) {
      return { syncedCount: 0, failedCount: 0 };
    }

    let syncedCount = 0;
    let failedCount = 0;
    const remainingDrafts = [];

    for (const draft of drafts) {
      try {
        await apiSubmitFn(draft);
        syncedCount++;
      } catch (err) {
        console.error('Failed to sync draft ' + draft.queueId + ':', err);
        failedCount++;
        remainingDrafts.push(draft);
      }
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(remainingDrafts));
    } catch (err) {
      console.error('Failed to update queue after sync:', err);
    }

    return { syncedCount, failedCount };
  }
};
