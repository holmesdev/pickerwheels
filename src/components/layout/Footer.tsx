/**
 * Site-wide footer
 */
export default function Footer() {
  const year = new Date().getFullYear()
  return <footer className="text-center">&copy; {year} Picker Wheels</footer>
}
