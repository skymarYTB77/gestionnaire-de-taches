import { google } from 'googleapis';
import { Client } from '@microsoft/microsoft-graph-client';

// Configuration Google Calendar
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET;

const googleAuth = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  `${window.location.origin}/auth/google/callback`
);

export const googleCalendarApi = {
  async authorize() {
    const authUrl = googleAuth.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/calendar']
    });
    window.location.href = authUrl;
  },

  async createEvent(todo) {
    const calendar = google.calendar({ version: 'v3', auth: googleAuth });
    
    const event = {
      summary: todo.name,
      description: `Priorité: ${todo.priority}\nTags: ${todo.tags.join(', ')}`,
      start: {
        date: todo.dateStart,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      end: {
        date: todo.dateStart,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    };

    await calendar.events.insert({
      calendarId: 'primary',
      resource: event
    });
  }
};

// Configuration Microsoft To Do
export const microsoftTodoApi = {
  async authorize() {
    // Redirection vers l'authentification Microsoft
    const msalConfig = {
      auth: {
        clientId: process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID,
        redirectUri: `${window.location.origin}/auth/microsoft/callback`
      }
    };
    window.location.href = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${msalConfig.auth.clientId}&response_type=code&redirect_uri=${msalConfig.auth.redirectUri}&scope=Tasks.ReadWrite`;
  },

  async createTask(todo) {
    const client = Client.init({
      authProvider: (done) => {
        done(null, localStorage.getItem('msToken'));
      }
    });

    await client.api('/me/todo/lists/tasks').post({
      title: todo.name,
      importance: todo.priority === 'high' ? 'high' : 'normal',
      dueDateTime: new Date(todo.dateStart).toISOString()
    });
  }
};

// Configuration Apple Reminders (via l'API Web)
export const appleRemindersApi = {
  async authorize() {
    // Redirection vers l'authentification Apple
    window.location.href = `https://appleid.apple.com/auth/authorize?client_id=${process.env.NEXT_PUBLIC_APPLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.origin + '/auth/apple/callback')}&response_type=code&scope=reminders`;
  },

  async createReminder(todo) {
    // Implémentation de l'API Apple Reminders
    const response = await fetch('https://api.apple.com/reminders/v1/tasks', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('appleToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: todo.name,
        dueDate: todo.dateStart,
        priority: todo.priority === 'high' ? 1 : 5
      })
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la création du rappel Apple');
    }
  }
};