import Sidebar from "./Sidebar"

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 ml-48 p-6 bg-white min-h-screen">
        {children}
      </main>
    </div>
  )
}
