export const googleCalendarApi = {
  async authorize() {
    try {
      const response = await fetch('/api/google/auth');
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error during Google Calendar authorization:', error);
      throw error;
    }
  },

  async createEvent(todo) {
    try {
      const accessToken = localStorage.getItem('googleAccessToken');
      const response = await fetch('/api/google/calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ todo, accessToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to create Google Calendar event');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating Google Calendar event:', error);
      throw error;
    }
  }
};

export const microsoftTodoApi = {
  async authorize() {
    alert('Microsoft Todo integration coming soon!');
  },

  async createTask(todo) {
    console.log('Microsoft Todo create task not implemented', todo);
  }
};

export const appleRemindersApi = {
  async authorize() {
    alert('Apple Reminders integration coming soon!');
  },

  async createReminder(todo) {
    console.log('Apple Reminders create reminder not implemented', todo);
  }
};