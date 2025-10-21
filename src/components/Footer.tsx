import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 bg-white">
      {/* Customer Reviews Section */}
      <div className="border-t border-b bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h3 className="text-2xl font-semibold text-slate-900 mb-8">Customer Reviews</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Mahfuzur Rahman", platform: "Daraz", rating: 5, text: "Quality product, premium looks, premium packaging and fast delivery. Hoping that it will last long too. Thanks GRAYS. 10/10" },
              { name: "Rakibul Hasan", platform: "Facebook", rating: 5, text: "I received a belt from Grays, I'm very happy with it. The quality is excellent, it looks great, and fits perfectly. recommended!" },
              { name: "Kamal Haque", platform: "Facebook", rating: 5, text: "Great products and excellent customer service. I've ordered multiple times and I'm always satisfied. Highly recommended!" }
            ].map((review, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-slate-700 text-sm mb-4">{review.text}</p>
                <div className="text-sm">
                  <div className="font-medium text-slate-900">{review.name}</div>
                  <div className="text-slate-500 text-xs">{review.platform}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Newsletter */}
          <div className="md:col-span-2">
            <h3 className="font-semibold text-lg text-slate-900 mb-3">Stay in the loop</h3>
            <p className="text-sm text-slate-600 mb-4">Get updates on new arrivals and exclusive offers from Grays.</p>
            <form className="flex gap-2">
              <input type="email" placeholder="Your email" className="border border-slate-300 px-3 py-2 rounded flex-1 text-sm" />
              <button className="bg-slate-900 text-white px-4 py-2 rounded text-sm font-medium hover:bg-slate-800 transition">Subscribe</button>
            </form>
          </div>

          {/* My Account */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">My Account</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/shop" className="hover:text-slate-900 transition">My orders</Link></li>
              <li><Link href="/shop" className="hover:text-slate-900 transition">My returns</Link></li>
              <li><Link href="/contact" className="hover:text-slate-900 transition">My information</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Customer Service</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/contact" className="hover:text-slate-900 transition">Payments</Link></li>
              <li><Link href="/contact" className="hover:text-slate-900 transition">Shipping & delivery</Link></li>
              <li><Link href="/contact" className="hover:text-slate-900 transition">Returns</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/about" className="hover:text-slate-900 transition">About</Link></li>
              <li><Link href="/contact" className="hover:text-slate-900 transition">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-slate-900 transition">Privacy</Link></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t pt-8">
          {/* Contact Info */}
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="flex gap-3">
              <Phone size={18} className="text-slate-600 shrink-0 mt-1" />
              <div className="text-sm">
                <div className="font-medium text-slate-900">Phone</div>
                <div className="text-slate-600">+1 (555) 123-4567</div>
              </div>
            </div>
            <div className="flex gap-3">
              <Mail size={18} className="text-slate-600 shrink-0 mt-1" />
              <div className="text-sm">
                <div className="font-medium text-slate-900">Email</div>
                <div className="text-slate-600">support@grays.com</div>
              </div>
            </div>
            <div className="flex gap-3">
              <MapPin size={18} className="text-slate-600 shrink-0 mt-1" />
              <div className="text-sm">
                <div className="font-medium text-slate-900">Address</div>
                <div className="text-slate-600">123 Grays Street, City, ST 12345</div>
              </div>
            </div>
          </div>

          {/* Social & Copyright */}
          <div className="flex items-center justify-between border-t pt-8">
            <div className="text-sm text-slate-600">© {new Date().getFullYear()} Grays. All rights reserved.</div>
            <div className="flex gap-4">
              <Link href="#" aria-label="Facebook"><Facebook size={18} className="text-slate-600 hover:text-slate-900 transition" /></Link>
              <Link href="#" aria-label="Instagram"><Instagram size={18} className="text-slate-600 hover:text-slate-900 transition" /></Link>
              <Link href="#" aria-label="Twitter"><Twitter size={18} className="text-slate-600 hover:text-slate-900 transition" /></Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
