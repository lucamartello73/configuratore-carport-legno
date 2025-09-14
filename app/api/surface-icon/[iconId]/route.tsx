import { type NextRequest, NextResponse } from "next/server"

const SURFACE_ICONS: Record<string, { name: string; svg: string; color: string }> = {
  concrete: {
    name: "Cemento",
    color: "#6B7280",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="#E5E7EB"/>
      <g fill="#6B7280" opacity="0.3">
        <rect x="10" y="10" width="15" height="15"/>
        <rect x="35" y="20" width="12" height="12"/>
        <rect x="60" y="15" width="18" height="18"/>
        <rect x="20" y="45" width="14" height="14"/>
        <rect x="50" y="50" width="16" height="16"/>
        <rect x="75" y="40" width="13" height="13"/>
        <rect x="15" y="75" width="17" height="17"/>
        <rect x="45" y="80" width="15" height="15"/>
        <rect x="70" y="70" width="12" height="12"/>
      </g>
    </svg>`,
  },
  wood: {
    name: "Legno",
    color: "#92400E",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="#FED7AA"/>
      <g stroke="#92400E" stroke-width="1" fill="none">
        <path d="M0 20 Q25 15 50 20 T100 20"/>
        <path d="M0 40 Q25 35 50 40 T100 40"/>
        <path d="M0 60 Q25 55 50 60 T100 60"/>
        <path d="M0 80 Q25 75 50 80 T100 80"/>
      </g>
      <g fill="#92400E" opacity="0.2">
        <circle cx="20" cy="30" r="2"/>
        <circle cx="70" cy="50" r="1.5"/>
        <circle cx="40" cy="70" r="1"/>
      </g>
    </svg>`,
  },
  stone: {
    name: "Pietra",
    color: "#78716C",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="#F3F4F6"/>
      <g fill="#78716C" opacity="0.4">
        <polygon points="10,10 30,15 25,35 5,30"/>
        <polygon points="35,5 55,10 60,25 40,20"/>
        <polygon points="65,15 85,20 80,40 60,35"/>
        <polygon points="15,45 35,50 30,70 10,65"/>
        <polygon points="45,40 65,45 70,60 50,55"/>
        <polygon points="75,50 95,55 90,75 70,70"/>
        <polygon points="20,80 40,85 35,95 15,90"/>
        <polygon points="50,75 70,80 75,95 55,90"/>
      </g>
    </svg>`,
  },
  ceramic: {
    name: "Ceramica",
    color: "#DC2626",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="#FEF2F2"/>
      <g stroke="#DC2626" stroke-width="2" fill="none">
        <rect x="5" y="5" width="40" height="40"/>
        <rect x="55" y="5" width="40" height="40"/>
        <rect x="5" y="55" width="40" height="40"/>
        <rect x="55" y="55" width="40" height="40"/>
      </g>
      <g fill="#DC2626" opacity="0.1">
        <rect x="5" y="5" width="40" height="40"/>
        <rect x="55" y="55" width="40" height="40"/>
      </g>
    </svg>`,
  },
  metal: {
    name: "Metallo",
    color: "#374151",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#9CA3AF"/>
          <stop offset="50%" style="stop-color:#374151"/>
          <stop offset="100%" style="stop-color:#6B7280"/>
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#metalGrad)"/>
      <g stroke="#1F2937" stroke-width="1" fill="none" opacity="0.5">
        <line x1="0" y1="25" x2="100" y2="25"/>
        <line x1="0" y1="50" x2="100" y2="50"/>
        <line x1="0" y1="75" x2="100" y2="75"/>
      </g>
    </svg>`,
  },
  composite: {
    name: "Composito",
    color: "#059669",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="#ECFDF5"/>
      <g fill="#059669" opacity="0.3">
        <path d="M0 0 L20 0 L15 20 L0 15 Z"/>
        <path d="M25 5 L45 5 L40 25 L25 20 Z"/>
        <path d="M50 0 L70 0 L65 20 L50 15 Z"/>
        <path d="M75 5 L95 5 L90 25 L75 20 Z"/>
        <path d="M5 30 L25 30 L20 50 L5 45 Z"/>
        <path d="M30 35 L50 35 L45 55 L30 50 Z"/>
        <path d="M55 30 L75 30 L70 50 L55 45 Z"/>
        <path d="M80 35 L100 35 L95 55 L80 50 Z"/>
        <path d="M0 60 L20 60 L15 80 L0 75 Z"/>
        <path d="M25 65 L45 65 L40 85 L25 80 Z"/>
        <path d="M50 60 L70 60 L65 80 L50 75 Z"/>
        <path d="M75 65 L95 65 L90 85 L75 80 Z"/>
      </g>
    </svg>`,
  },
  tiles: {
    name: "Piastrelle",
    color: "#3B82F6",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="#EFF6FF"/>
      <g stroke="#3B82F6" stroke-width="1" fill="#DBEAFE">
        <rect x="2" y="2" width="21" height="21"/>
        <rect x="27" y="2" width="21" height="21"/>
        <rect x="52" y="2" width="21" height="21"/>
        <rect x="77" y="2" width="21" height="21"/>
        <rect x="2" y="27" width="21" height="21"/>
        <rect x="27" y="27" width="21" height="21"/>
        <rect x="52" y="27" width="21" height="21"/>
        <rect x="77" y="27" width="21" height="21"/>
        <rect x="2" y="52" width="21" height="21"/>
        <rect x="27" y="52" width="21" height="21"/>
        <rect x="52" y="52" width="21" height="21"/>
        <rect x="77" y="52" width="21" height="21"/>
        <rect x="2" y="77" width="21" height="21"/>
        <rect x="27" y="77" width="21" height="21"/>
        <rect x="52" y="77" width="21" height="21"/>
        <rect x="77" y="77" width="21" height="21"/>
      </g>
    </svg>`,
  },
  parquet: {
    name: "Parquet",
    color: "#A16207",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="#FEF3C7"/>
      <g stroke="#A16207" stroke-width="1" fill="#FDE68A">
        <rect x="0" y="5" width="30" height="8"/>
        <rect x="0" y="18" width="25" height="8"/>
        <rect x="0" y="31" width="35" height="8"/>
        <rect x="0" y="44" width="28" height="8"/>
        <rect x="0" y="57" width="32" height="8"/>
        <rect x="0" y="70" width="26" height="8"/>
        <rect x="0" y="83" width="30" height="8"/>
        <rect x="35" y="5" width="25" height="8"/>
        <rect x="30" y="18" width="30" height="8"/>
        <rect x="40" y="31" width="28" height="8"/>
        <rect x="33" y="44" width="32" height="8"/>
        <rect x="37" y="57" width="26" height="8"/>
        <rect x="31" y="70" width="29" height="8"/>
        <rect x="35" y="83" width="27" height="8"/>
        <rect x="65" y="5" width="35" height="8"/>
        <rect x="65" y="18" width="30" height="8"/>
        <rect x="73" y="31" width="27" height="8"/>
        <rect x="70" y="44" width="30" height="8"/>
        <rect x="68" y="57" width="32" height="8"/>
        <rect x="65" y="70" width="35" height="8"/>
        <rect x="67" y="83" width="33" height="8"/>
      </g>
    </svg>`,
  },
  laminate: {
    name: "Laminato",
    color: "#B45309",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="#FEF3C7"/>
      <g stroke="#B45309" stroke-width="0.5" fill="#FBBF24" opacity="0.7">
        <rect x="0" y="0" width="100" height="12"/>
        <rect x="0" y="16" width="100" height="12"/>
        <rect x="0" y="32" width="100" height="12"/>
        <rect x="0" y="48" width="100" height="12"/>
        <rect x="0" y="64" width="100" height="12"/>
        <rect x="0" y="80" width="100" height="12"/>
      </g>
      <g stroke="#B45309" stroke-width="1" fill="none">
        <line x1="0" y1="12" x2="100" y2="12"/>
        <line x1="0" y1="28" x2="100" y2="28"/>
        <line x1="0" y1="44" x2="100" y2="44"/>
        <line x1="0" y1="60" x2="100" y2="60"/>
        <line x1="0" y1="76" x2="100" y2="76"/>
        <line x1="0" y1="92" x2="100" y2="92"/>
      </g>
    </svg>`,
  },
  vinyl: {
    name: "Vinile",
    color: "#7C3AED",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="#F3E8FF"/>
      <g fill="#7C3AED" opacity="0.2">
        <polygon points="10,10 40,10 35,40 5,40"/>
        <polygon points="45,5 75,5 70,35 40,35"/>
        <polygon points="80,10 100,10 100,40 75,40"/>
        <polygon points="5,45 35,45 30,75 0,75"/>
        <polygon points="40,40 70,40 65,70 35,70"/>
        <polygon points="75,45 100,45 100,75 70,75"/>
        <polygon points="0,80 30,80 25,100 0,100"/>
        <polygon points="35,75 65,75 60,100 30,100"/>
        <polygon points="70,80 100,80 100,100 65,100"/>
      </g>
      <g stroke="#7C3AED" stroke-width="1" fill="none" opacity="0.5">
        <path d="M0 25 Q25 20 50 25 T100 25"/>
        <path d="M0 50 Q25 45 50 50 T100 50"/>
        <path d="M0 75 Q25 70 50 75 T100 75"/>
      </g>
    </svg>`,
  },
  marble: {
    name: "Marmo",
    color: "#E5E7EB",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="#F9FAFB"/>
      <g stroke="#9CA3AF" stroke-width="1" fill="none" opacity="0.6">
        <path d="M0 20 Q30 15 60 25 Q80 30 100 20"/>
        <path d="M0 40 Q20 35 40 45 Q70 50 100 40"/>
        <path d="M0 60 Q25 55 50 65 Q75 70 100 60"/>
        <path d="M0 80 Q35 75 65 85 Q85 90 100 80"/>
      </g>
      <g fill="#6B7280" opacity="0.1">
        <path d="M10 10 Q30 20 50 15 Q70 10 90 20 L90 30 Q70 25 50 30 Q30 35 10 25 Z"/>
        <path d="M15 50 Q35 60 55 55 Q75 50 95 60 L95 70 Q75 65 55 70 Q35 75 15 65 Z"/>
      </g>
    </svg>`,
  },
  granite: {
    name: "Granito",
    color: "#1F2937",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="#374151"/>
      <g fill="#9CA3AF" opacity="0.3">
        <circle cx="15" cy="15" r="2"/>
        <circle cx="35" cy="10" r="1.5"/>
        <circle cx="55" cy="20" r="1"/>
        <circle cx="75" cy="15" r="2.5"/>
        <circle cx="85" cy="25" r="1"/>
        <circle cx="25" cy="35" r="1.5"/>
        <circle cx="45" cy="40" r="2"/>
        <circle cx="65" cy="35" r="1"/>
        <circle cx="85" cy="45" r="1.5"/>
        <circle cx="15" cy="55" r="1"/>
        <circle cx="35" cy="60" r="2.5"/>
        <circle cx="55" cy="55" r="1.5"/>
        <circle cx="75" cy="65" r="1"/>
        <circle cx="25" cy="75" r="2"/>
        <circle cx="45" cy="80" r="1"/>
        <circle cx="65" cy="75" r="1.5"/>
        <circle cx="85" cy="85" r="2"/>
      </g>
      <g fill="#F3F4F6" opacity="0.1">
        <circle cx="20" cy="25" r="0.5"/>
        <circle cx="40" cy="30" r="0.5"/>
        <circle cx="60" cy="25" r="0.5"/>
        <circle cx="80" cy="35" r="0.5"/>
        <circle cx="30" cy="50" r="0.5"/>
        <circle cx="50" cy="45" r="0.5"/>
        <circle cx="70" cy="55" r="0.5"/>
        <circle cx="20" cy="70" r="0.5"/>
        <circle cx="40" cy="75" r="0.5"/>
        <circle cx="60" cy="85" r="0.5"/>
        <circle cx="80" cy="75" r="0.5"/>
      </g>
    </svg>`,
  },
}

export async function GET(request: NextRequest, { params }: { params: { iconId: string } }) {
  const { iconId } = params

  const iconData = SURFACE_ICONS[iconId]

  if (!iconData) {
    return new NextResponse("Icon not found", { status: 404 })
  }

  return new NextResponse(iconData.svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
