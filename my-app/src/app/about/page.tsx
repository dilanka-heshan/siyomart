import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'About SiyoMart - Our Story & Mission',
  description: 'Learn about SiyoMart, connecting Sri Lankan artisans with global customers through authentic handcrafted products and sustainable practices.',
}

export default function AboutPage() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1606196480025-27347b5ea8fa?q=80&w=2070&auto=format&fit=crop"
            alt="Sri Lankan Craftmanship"
            fill
            priority
            className="object-cover brightness-[0.85]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="relative h-full flex items-end">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Our Story</h1>
            <div className="w-24 h-1 bg-amber-500 mb-6"></div>
            <p className="text-white text-xl md:text-2xl max-w-2xl">
              Connecting heritage with homes across the world
            </p>
          </div>
        </div>
      </section>

      {/* Main About Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-amber-50 p-8 md:p-12 rounded-lg shadow-sm border border-amber-100 mb-16">
              <h2 className="text-3xl font-bold text-center mb-8 text-amber-900">About Us</h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                At SiyoMart, we believe that every product has a soul, woven with the dedication, history, and craftsmanship of Sri Lanka's finest artisans. Our platform connects the world with the beauty of authentic, handcrafted products—each piece a testament to generations of skill and passion.
              </p>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                We are more than just an e-commerce store; we are a movement to celebrate traditional craftsmanship while ensuring fair wages and sustainable livelihoods for our artisans. By supporting us, you become part of a larger mission—to empower creators, preserve artistry, and bring unique Sri Lankan treasures to homes across the globe.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Join us in celebrating the beauty of tradition, the power of craftsmanship, and the magic of stories told through handmade art.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 md:gap-16 mb-16">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                <div className="w-16 h-1 bg-amber-500 mb-6"></div>
                <p className="text-gray-700">
                  To create a world where traditional Sri Lankan craftsmanship thrives in the global marketplace, preserving cultural heritage while empowering local communities through sustainable economic opportunities.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                <div className="w-16 h-1 bg-amber-500 mb-6"></div>
                <p className="text-gray-700">
                  To build an ethical marketplace that connects Sri Lankan artisans directly with global customers, eliminating middlemen and ensuring fair compensation while showcasing the rich diversity and exceptional quality of Sri Lankan craftsmanship.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Our Core Values</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md transform transition hover:-translate-y-1">
              <div className="h-16 w-16 mx-auto mb-6 rounded-full bg-amber-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-amber-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Artisan First</h3>
              <p className="text-gray-600 text-center">
                We prioritize the well-being and fair compensation of our artisans, ensuring they receive proper recognition and rewards for their craft.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md transform transition hover:-translate-y-1">
              <div className="h-16 w-16 mx-auto mb-6 rounded-full bg-amber-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-amber-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Cultural Preservation</h3>
              <p className="text-gray-600 text-center">
                We are dedicated to preserving and promoting Sri Lanka's rich cultural heritage and traditional craftsmanship for future generations.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md transform transition hover:-translate-y-1">
              <div className="h-16 w-16 mx-auto mb-6 rounded-full bg-amber-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-amber-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 0 0-8.862 12.872M12.75 3.031a9 9 0 0 1 6.69 14.036m0 0-.177-.529A2.25 2.25 0 0 0 17.128 15H16.5l-.324-.324a1.453 1.453 0 0 0-2.328.377l-.036.073a1.586 1.586 0 0 1-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598-.542 1.923-1.35l.009-.018a.75.75 0 0 1 .584-.396l.79-.088a1.354 1.354 0 0 0 .553-.267l.066-.05Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Sustainability</h3>
              <p className="text-gray-600 text-center">
                We advocate for environmentally conscious practices throughout our supply chain, from sourcing materials to packaging and shipping.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Section with Timeline */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Our Journey</h2>
          
          <div className="relative max-w-3xl mx-auto">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-amber-200"></div>
            
            {/* Timeline Events */}
            <div className="relative z-10">
              {/* Event 1 */}
              <div className="mb-16">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-amber-500 rounded-full h-8 w-8 flex items-center justify-center z-10">
                    <span className="text-white font-bold">1</span>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="font-bold text-xl mb-2">The Inspiration</h3>
                  <p className="text-gray-600">
                    Our founders witnessed talented Sri Lankan artisans struggling to reach global markets despite their exceptional craftsmanship. This sparked the idea for a platform that could bridge this gap.
                  </p>
                </div>
              </div>
              
              {/* Event 2 */}
              <div className="mb-16">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-amber-500 rounded-full h-8 w-8 flex items-center justify-center z-10">
                    <span className="text-white font-bold">2</span>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="font-bold text-xl mb-2">Building Connections</h3>
                  <p className="text-gray-600">
                    We traveled across Sri Lanka, from coastal villages to mountain towns, meeting artisans and learning about their unique crafts and challenges. These relationships form the foundation of SiyoMart.
                  </p>
                </div>
              </div>
              
              {/* Event 3 */}
              <div>
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-amber-500 rounded-full h-8 w-8 flex items-center justify-center z-10">
                    <span className="text-white font-bold">3</span>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="font-bold text-xl mb-2">SiyoMart Today</h3>
                  <p className="text-gray-600">
                    Today, SiyoMart represents over 500 artisans from every region of Sri Lanka, featuring thousands of unique handcrafted products and delivering to customers in over 50 countries worldwide.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Meet Our Team</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Team Member 1 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-64 relative">
                <Image
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop"
                  alt="Founder"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-1">Amara Perera</h3>
                <p className="text-amber-600 mb-3">Founder & CEO</p>
                <p className="text-gray-600 text-sm">
                  With a background in sustainable development and a passion for Sri Lankan arts, Amara founded SiyoMart to create a bridge between artisans and global markets.
                </p>
              </div>
            </div>
            
            {/* Team Member 2 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-64 relative">
                <Image
                  src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=1974&auto=format&fit=crop"
                  alt="Co-founder"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-1">Nihal Fernando</h3>
                <p className="text-amber-600 mb-3">Co-founder & Creative Director</p>
                <p className="text-gray-600 text-sm">
                  A respected designer with deep roots in Sri Lankan craft traditions, Nihal ensures that each product on SiyoMart meets our standards for quality and cultural authenticity.
                </p>
              </div>
            </div>
            
            {/* Team Member 3 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-64 relative">
                <Image
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop"
                  alt="Head of Artisan Relations"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-1">Lakshmi Jayawardena</h3>
                <p className="text-amber-600 mb-3">Head of Artisan Relations</p>
                <p className="text-gray-600 text-sm">
                  Having worked with rural communities for over a decade, Lakshmi builds and nurtures our relationships with artisans across the country, ensuring fair practices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Become Part of Our Story</h2>
            <p className="text-lg text-gray-700 mb-8">
              When you purchase from SiyoMart, you're not just buying a product – you're investing in tradition, supporting artisans, and bringing a piece of Sri Lankan heritage into your home.
            </p>
            <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
              <Link href="/shop" className="px-8 py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition shadow-md font-medium">
                Explore Our Products
              </Link>
              <Link href="/contact" className="px-8 py-3 bg-white border border-amber-600 text-amber-600 rounded-md hover:bg-amber-50 transition shadow-md font-medium">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
