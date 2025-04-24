export function UserAvatar({ username }) {
  // Get first letter of username
  const initial = username ? username.charAt(0).toUpperCase() : "U"

  // Generate a deterministic color based on the username
  const colors = [
    "bg-rose-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-amber-500",
    "bg-yellow-500",
    "bg-lime-500",
    "bg-green-500",
    "bg-emerald-500",
    "bg-teal-500",
    "bg-cyan-500",
    "bg-sky-500",
    "bg-blue-500",
    "bg-indigo-500",
    "bg-violet-500",
    "bg-purple-500",
    "bg-fuchsia-500",
  ]
  const colorIndex = username
    ? username.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
    : 0
  const bgColor = colors[colorIndex]

  return (
    <div className={`flex items-center justify-center h-10 w-10 rounded-full ${bgColor} text-white font-medium`}>
      {initial}
    </div>
  )
}
