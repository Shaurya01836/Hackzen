"use client";

export default function HackathonHero({ hackathon, isRegistered, isSaved }) {
  const {
    images,
  } = hackathon;

  return (
    <div className="w-full">
      {/* Full Width Hero Banner */}
      <div className="relative w-full rounded-2xl overflow-hidden border mb-8">
        <img
          src={images?.banner?.url || "/placeholder.svg?height=400&width=800"}
          alt={hackathon.name}
          className="object-cover w-full h-56 md:h-[400px] lg:h-[500px]"
        />
        
      </div>
    </div>
  );
}
