'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { googleCalendarApi, microsoftTodoApi, appleRemindersApi } from '../lib/integrations';

export default function Settings({ isOpen, onClose, todoLists, setTodoLists }) {
  const [integrations, setIntegrations] = useState({
    googleCalendar: false,
    microsoftTodo: false,
    appleReminders: false
  });
  const { user } = useAuth();

  const handleIntegrationChange = async (integration) => {
    try {
      if (!integrations[integration]) {
        switch (integration) {
          case 'googleCalendar':
            await googleCalendarApi.authorize();
            break;
          case 'microsoftTodo':
            await microsoftTodoApi.authorize();
            break;
          case 'appleReminders':
            await appleRemindersApi.authorize();
            break;
        }
      }

      setIntegrations(prev => ({
        ...prev,
        [integration]: !prev[integration]
      }));

      // Synchroniser les tâches existantes
      if (!integrations[integration]) {
        const tasks = todoLists.flatMap(list => list.data);
        for (const task of tasks) {
          switch (integration) {
            case 'googleCalendar':
              await googleCalendarApi.createEvent(task);
              break;
            case 'microsoftTodo':
              await microsoftTodoApi.createTask(task);
              break;
            case 'appleReminders':
              await appleRemindersApi.createReminder(task);
              break;
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'intégration:', error);
      alert('Une erreur est survenue lors de l\'intégration. Veuillez réessayer.');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[480px] bg-neutral-800 rounded-xl p-6 z-50 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Paramètres</h2>
          <button 
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-white font-medium mb-3">Intégrations</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-neutral-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-xl">📅</span>
                  <div>
                    <p className="text-white">Google Calendar</p>
                    <p className="text-sm text-neutral-400">Synchroniser les tâches avec votre calendrier</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={integrations.googleCalendar}
                    onChange={() => handleIntegrationChange('googleCalendar')}
                  />
                  <div className="w-11 h-6 bg-neutral-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-200"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-neutral-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-xl">✓</span>
                  <div>
                    <p className="text-white">Microsoft To Do</p>
                    <p className="text-sm text-neutral-400">Synchroniser avec Microsoft To Do</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={integrations.microsoftTodo}
                    onChange={() => handleIntegrationChange('microsoftTodo')}
                  />
                  <div className="w-11 h-6 bg-neutral-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-200"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-neutral-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-xl">📝</span>
                  <div>
                    <p className="text-white">Apple Reminders</p>
                    <p className="text-sm text-neutral-400">Synchroniser avec Apple Reminders</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={integrations.appleReminders}
                    onChange={() => handleIntegrationChange('appleReminders')}
                  />
                  <div className="w-11 h-6 bg-neutral-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-200"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}