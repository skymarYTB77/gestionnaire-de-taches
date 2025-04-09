import './globals.css'
 
export const metadata = {
  title: 'Gestionnaire de taches',
  description: 'Une application de gestion de tâches rapide et flexible. Aucun compte requis.',
}
 
export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}