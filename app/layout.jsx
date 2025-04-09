import './globals.css'
import { AuthProvider } from '../contexts/AuthContext'
 
export const metadata = {
  title: 'Gestionnaire de taches',
  description: 'Une application de gestion de tâches rapide et flexible. Aucun compte requis.',
}
 
export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}