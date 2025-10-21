export default function NewsletterForm() {
  return (
    <form className="mt-4 flex gap-2">
      <input type="email" placeholder="Your email" className="border px-3 py-2 rounded w-full" />
      <button className="bg-sky-600 text-white px-4 py-2 rounded">Subscribe</button>
    </form>
  );
}
