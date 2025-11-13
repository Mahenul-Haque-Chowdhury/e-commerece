export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-semibold">Contact</h1>
      <p className="mt-4 text-slate-700">For inquiries, reach out at support@wesell.example (placeholder).</p>
      <form className="mt-6 space-y-3">
        <input placeholder="Your name" className="border w-full px-3 py-2 rounded" />
        <input type="email" placeholder="Your email" className="border w-full px-3 py-2 rounded" />
        <textarea placeholder="Message" className="border w-full px-3 py-2 rounded h-32" />
        <button className="bg-sky-600 text-white px-6 py-2 rounded">Send</button>
      </form>
    </div>
  );
}
