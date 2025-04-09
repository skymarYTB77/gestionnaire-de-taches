import { google } from 'googleapis';

export async function POST(request) {
  try {
    const { todo, accessToken } = await request.json();

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: accessToken
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    await calendar.events.insert({
      calendarId: 'primary',
      resource: {
        summary: todo.name,
        description: `Priority: ${todo.priority}\nTags: ${todo.tags.join(', ')}`,
        start: {
          date: todo.dateStart,
          timeZone: 'UTC'
        },
        end: {
          date: todo.dateStart,
          timeZone: 'UTC'
        }
      }
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error creating Google Calendar event:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}