// Ambient declaration for Google Maps JS API
declare global {
  interface Window {
    google?: any;
  }
  namespace google {
    namespace maps {
      type Map = any;
      type Marker = any;
      type InfoWindow = any;
      type MapTypeStyle = any;
    }
  }
}
declare const google: any;

import React, { useEffect, useRef, useState } from 'react';
import { GameState } from '../types/game';
import { RealCountryData, REAL_WORLD_COUNTRIES, getCountryDebtBillions } from '../data/realWorldMapData';
import { sound } from '../utils/sound';
import {
  Search,
  Crosshair,
  ZoomIn,
  ZoomOut,
  Layers,
  Globe,
  Swords,
  ShieldAlert,
  Building,
  Landmark,
  ExternalLink,
  MapPin,
  Compass,
  AlertTriangle,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface GoogleWorldMapProps {
  state: GameState;
  onSelectCountry: (country: RealCountryData) => void;
  onOpenWarSimulator: (country: RealCountryData) => void;
  onOpenSanctions: (country: RealCountryData) => void;
  onOpenInvestments: (country: RealCountryData) => void;
  onOpenLending: (country: RealCountryData) => void;
  onOpenTreaties: (country: RealCountryData) => void;
  onLogEvent: (text: string, type: 'positive' | 'warning' | 'negative' | 'neutral') => void;
}

// Built-in Geopolitical coordinates for world nations & capitals
export const COUNTRY_GEO_COORDINATES: Record<string, { lat: number; lng: number; zoom: number; countryId: string }> = {
  // Nordamerika
  usa: { lat: 38.9072, lng: -77.0369, zoom: 4, countryId: 'usa' },
  'washington': { lat: 38.9072, lng: -77.0369, zoom: 11, countryId: 'usa' },
  'new york': { lat: 40.7128, lng: -74.0060, zoom: 11, countryId: 'usa' },
  can: { lat: 45.4215, lng: -75.6972, zoom: 4, countryId: 'can' },
  'ottawa': { lat: 45.4215, lng: -75.6972, zoom: 11, countryId: 'can' },
  mex: { lat: 19.4326, lng: -99.1332, zoom: 5, countryId: 'mex' },
  'mexiko-stadt': { lat: 19.4326, lng: -99.1332, zoom: 11, countryId: 'mex' },

  // Europa
  deu: { lat: 52.5200, lng: 13.4050, zoom: 6, countryId: 'deu' },
  'berlin': { lat: 52.5200, lng: 13.4050, zoom: 12, countryId: 'deu' },
  fra: { lat: 48.8566, lng: 2.3522, zoom: 6, countryId: 'fra' },
  'paris': { lat: 48.8566, lng: 2.3522, zoom: 12, countryId: 'fra' },
  gbr: { lat: 51.5074, lng: -0.1278, zoom: 6, countryId: 'gbr' },
  'london': { lat: 51.5074, lng: -0.1278, zoom: 12, countryId: 'gbr' },
  ita: { lat: 41.9028, lng: 12.4964, zoom: 6, countryId: 'ita' },
  'rom': { lat: 41.9028, lng: 12.4964, zoom: 12, countryId: 'ita' },
  esp: { lat: 40.4168, lng: -3.7038, zoom: 6, countryId: 'esp' },
  'madrid': { lat: 40.4168, lng: -3.7038, zoom: 12, countryId: 'esp' },
  pol: { lat: 52.2297, lng: 21.0122, zoom: 6, countryId: 'pol' },
  'warschau': { lat: 52.2297, lng: 21.0122, zoom: 12, countryId: 'pol' },
  ukr: { lat: 50.4501, lng: 30.5234, zoom: 6, countryId: 'ukr' },
  'kiew': { lat: 50.4501, lng: 30.5234, zoom: 12, countryId: 'ukr' },
  rus: { lat: 55.7558, lng: 37.6173, zoom: 4, countryId: 'rus' },
  'moskau': { lat: 55.7558, lng: 37.6173, zoom: 11, countryId: 'rus' },
  swe: { lat: 59.3293, lng: 18.0686, zoom: 5, countryId: 'swe' },
  nor: { lat: 59.9139, lng: 10.7522, zoom: 5, countryId: 'nor' },
  che: { lat: 46.9480, lng: 7.4474, zoom: 7, countryId: 'che' },
  aut: { lat: 48.2082, lng: 16.3738, zoom: 7, countryId: 'aut' },
  nld: { lat: 52.3676, lng: 4.9041, zoom: 7, countryId: 'nld' },
  bel: { lat: 50.8503, lng: 4.3517, zoom: 7, countryId: 'bel' },
  tur: { lat: 39.9334, lng: 32.8597, zoom: 6, countryId: 'tur' },
  'ankara': { lat: 39.9334, lng: 32.8597, zoom: 11, countryId: 'tur' },

  // Asien
  chn: { lat: 39.9042, lng: 116.4074, zoom: 4, countryId: 'chn' },
  'peking': { lat: 39.9042, lng: 116.4074, zoom: 11, countryId: 'chn' },
  'beijing': { lat: 39.9042, lng: 116.4074, zoom: 11, countryId: 'chn' },
  'shanghai': { lat: 31.2304, lng: 121.4737, zoom: 11, countryId: 'chn' },
  jpn: { lat: 35.6762, lng: 139.6503, zoom: 6, countryId: 'jpn' },
  'tokio': { lat: 35.6762, lng: 139.6503, zoom: 11, countryId: 'jpn' },
  ind: { lat: 28.6139, lng: 77.2090, zoom: 5, countryId: 'ind' },
  'neu-delhi': { lat: 28.6139, lng: 77.2090, zoom: 11, countryId: 'ind' },
  kor: { lat: 37.5665, lng: 126.9780, zoom: 7, countryId: 'kor' },
  'seoul': { lat: 37.5665, lng: 126.9780, zoom: 11, countryId: 'kor' },
  twn: { lat: 25.0330, lng: 121.5654, zoom: 8, countryId: 'twn' },
  'taipeh': { lat: 25.0330, lng: 121.5654, zoom: 12, countryId: 'twn' },
  idn: { lat: -6.2088, lng: 106.8456, zoom: 5, countryId: 'idn' },
  sau: { lat: 24.7136, lng: 46.6753, zoom: 6, countryId: 'sau' },
  'riad': { lat: 24.7136, lng: 46.6753, zoom: 11, countryId: 'sau' },
  irn: { lat: 35.6892, lng: 51.3890, zoom: 6, countryId: 'irn' },
  'teheran': { lat: 35.6892, lng: 51.3890, zoom: 11, countryId: 'irn' },
  isr: { lat: 31.7683, lng: 35.2137, zoom: 8, countryId: 'isr' },
  'jerusalem': { lat: 31.7683, lng: 35.2137, zoom: 12, countryId: 'isr' },

  // Südamerika & Ozeanien & Afrika
  bra: { lat: -15.7975, lng: -47.8919, zoom: 4, countryId: 'bra' },
  'brasilia': { lat: -15.7975, lng: -47.8919, zoom: 11, countryId: 'bra' },
  arg: { lat: -34.6037, lng: -58.3816, zoom: 4, countryId: 'arg' },
  'buenos aires': { lat: -34.6037, lng: -58.3816, zoom: 11, countryId: 'arg' },
  aus: { lat: -35.2809, lng: 149.1300, zoom: 4, countryId: 'aus' },
  'canberra': { lat: -35.2809, lng: 149.1300, zoom: 11, countryId: 'aus' },
  zaf: { lat: -25.7479, lng: 28.2293, zoom: 5, countryId: 'zaf' },
  'pretoria': { lat: -25.7479, lng: 28.2293, zoom: 11, countryId: 'zaf' },
  egy: { lat: 30.0444, lng: 31.2357, zoom: 6, countryId: 'egy' },
  'kairo': { lat: 30.0444, lng: 31.2357, zoom: 11, countryId: 'egy' },
  nga: { lat: 9.0765, lng: 7.3986, zoom: 6, countryId: 'nga' }
};

// Dark War-Room Map Style for Google Maps
const DARK_WAR_ROOM_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#090e17' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#05070c' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
  {
    featureType: 'administrative.country',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#f59e0b' }, { weight: 1.2 }]
  },
  {
    featureType: 'administrative.country',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#fbbf24' }]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#020408' }]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#334155' }]
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{ color: '#0f172a' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#1e293b' }]
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#1e293b' }]
  },
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }]
  }
];

export const GoogleWorldMap: React.FC<GoogleWorldMapProps> = ({
  state,
  onSelectCountry,
  onOpenWarSimulator,
  onOpenSanctions,
  onOpenInvestments,
  onOpenLending,
  onOpenTreaties,
  onLogEvent
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const activePinMarkerRef = useRef<google.maps.Marker | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeMapType, setActiveMapType] = useState<'dark' | 'satellite' | 'hybrid' | 'roadmap'>('dark');
  const [selectedPinCountry, setSelectedPinCountry] = useState<RealCountryData | null>(null);
  const [isDrawOnMapEmbedOpen, setIsDrawOnMapEmbedOpen] = useState<boolean>(false);

  const apiKey =
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyD-TS5MdTVEDkBZ-6aqksPeaJ9nfZj22Vg';

  // Load Google Maps API script
  useEffect(() => {
    if (window.google?.maps) {
      initMap();
      return;
    }

    const scriptId = 'google-maps-js-api-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initMap();
      };
      script.onerror = () => {
        setLoadError('Google Maps API konnte nicht geladen werden.');
      };
      document.head.appendChild(script);
    } else {
      script.addEventListener('load', () => initMap());
    }

    return () => {
      // cleanup markers
      markersRef.current.forEach(m => m.setMap(null));
      markersRef.current = [];
    };
  }, [apiKey]);

  // Initialize Map
  const initMap = () => {
    if (!mapContainerRef.current || !window.google?.maps) return;

    try {
      const map = new google.maps.Map(mapContainerRef.current, {
        center: { lat: 25.0, lng: 15.0 }, // Global overview center
        zoom: 2.8,
        minZoom: 2,
        maxZoom: 18,
        gestureHandling: 'greedy',
        mapTypeId: 'roadmap',
        styles: DARK_WAR_ROOM_STYLE,
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeControl: false
      });

      mapInstanceRef.current = map;
      infoWindowRef.current = new google.maps.InfoWindow();

      // Render geopolitical pins for real-world countries
      renderCountryMarkers(map);

      setIsMapLoaded(true);
    } catch (err: any) {
      console.error('Error initializing Google Maps:', err);
      setLoadError('Initialisierung der Karte fehlgeschlagen.');
    }
  };

  // Render Country markers on map
  const renderCountryMarkers = (map: google.maps.Map) => {
    // Clear old
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    REAL_WORLD_COUNTRIES.forEach((c) => {
      const geo = COUNTRY_GEO_COORDINATES[c.id];
      if (!geo) return;

      const markerColor = c.atWar ? '#ef4444' : c.tradePact ? '#f59e0b' : '#38bdf8';

      const marker = new google.maps.Marker({
        position: { lat: geo.lat, lng: geo.lng },
        map,
        title: `${c.name} (${c.capital})`,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: c.atWar ? 9 : 7,
          fillColor: markerColor,
          fillOpacity: 0.9,
          strokeColor: '#ffffff',
          strokeWeight: 1.5
        }
      });

      marker.addListener('click', () => {
        sound.playClick();
        handleSelectPlace(c, { lat: geo.lat, lng: geo.lng, zoom: geo.zoom });
      });

      markersRef.current.push(marker);
    });
  };

  // Handle Map Type change
  const handleChangeMapType = (type: 'dark' | 'satellite' | 'hybrid' | 'roadmap') => {
    setActiveMapType(type);
    if (!mapInstanceRef.current) return;

    if (type === 'dark') {
      mapInstanceRef.current.setMapTypeId('roadmap');
      mapInstanceRef.current.setOptions({ styles: DARK_WAR_ROOM_STYLE });
    } else if (type === 'satellite') {
      mapInstanceRef.current.setMapTypeId('satellite');
      mapInstanceRef.current.setOptions({ styles: null });
    } else if (type === 'hybrid') {
      mapInstanceRef.current.setMapTypeId('hybrid');
      mapInstanceRef.current.setOptions({ styles: null });
    } else {
      mapInstanceRef.current.setMapTypeId('roadmap');
      mapInstanceRef.current.setOptions({ styles: null });
    }
  };

  // Smooth Pan & Pin to location
  const handleSelectPlace = (
    country: RealCountryData,
    coords: { lat: number; lng: number; zoom?: number }
  ) => {
    setSelectedPinCountry(country);
    onSelectCountry(country);

    if (!mapInstanceRef.current || !window.google?.maps) return;

    // Smooth pan (Fly to location as requested)
    mapInstanceRef.current.panTo({ lat: coords.lat, lng: coords.lng });
    mapInstanceRef.current.setZoom(coords.zoom || 6);

    // Place high-visibility animated Pin Marker
    if (activePinMarkerRef.current) {
      activePinMarkerRef.current.setMap(null);
    }

    const pinMarker = new google.maps.Marker({
      position: { lat: coords.lat, lng: coords.lng },
      map: mapInstanceRef.current,
      title: `${country.name} - ${country.capital}`,
      animation: google.maps.Animation.DROP,
      icon: {
        path: 'M 12 2 C 8.13 2 5 5.13 5 9 c 0 5.25 7 13 7 13 s 7 -7.75 7 -13 c 0 -3.87 -3.13 -7 -7 -7 z',
        fillColor: country.atWar ? '#ef4444' : '#f59e0b',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
        scale: 1.8,
        anchor: new google.maps.Point(12, 22)
      }
    });

    activePinMarkerRef.current = pinMarker;

    // Open InfoWindow with details & direct buttons
    if (infoWindowRef.current) {
      const debt = getCountryDebtBillions(country);
      const contentString = `
        <div style="font-family: ui-sans-serif, system-ui, sans-serif; min-width: 260px; max-width: 320px; padding: 4px; color: #0f172a;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <strong style="font-size: 15px; color: #0f172a; font-weight: 800;">${country.name}</strong>
            <span style="font-size: 11px; font-weight: bold; padding: 2px 6px; border-radius: 4px; background: ${country.atWar ? '#fee2e2; color: #991b1b;' : '#fef3c7; color: #92400e;'}">
              ${country.atWar ? 'KRIEG' : country.tradePact ? 'FREIHANDEL' : 'NEUTRAL'}
            </span>
          </div>
          <div style="font-size: 12px; color: #475569; line-height: 1.4; margin-bottom: 8px;">
            <div><strong>Hauptstadt:</strong> ${country.capital}</div>
            <div><strong>BIP:</strong> $${country.gdpBillions} Mrd. | <strong>Schulden:</strong> $${debt} Mrd.</div>
            <div><strong>Führung:</strong> ${country.leaderGerman}</div>
            <div><strong>Militärstärke:</strong> ${country.militaryScore}/100</div>
          </div>
          <div style="font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 6px;">
            Klicken Sie im Kontrollpanel auf Aktionen für dieses Land.
          </div>
        </div>
      `;

      infoWindowRef.current.setContent(contentString);
      infoWindowRef.current.open({
        anchor: pinMarker,
        map: mapInstanceRef.current
      });
    }

    sound.playPin();
  };

  // Search logic (smooth pan to searched place or country)
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.trim().toLowerCase();

    // 1. Direct match in local catalog
    const matchedCountry = REAL_WORLD_COUNTRIES.find(
      c =>
        c.name.toLowerCase().includes(query) ||
        c.isoCode.toLowerCase() === query ||
        c.capital.toLowerCase().includes(query)
    );

    if (matchedCountry) {
      const geo = COUNTRY_GEO_COORDINATES[matchedCountry.id] || {
        lat: 50.0,
        lng: 10.0,
        zoom: 6,
        countryId: matchedCountry.id
      };
      handleSelectPlace(matchedCountry, geo);
      onLogEvent(`Karte zentriert auf: ${matchedCountry.name} (${matchedCountry.capital}).`, 'neutral');
      return;
    }

    // 2. Direct match in city/coord dictionary
    const coordMatchKey = Object.keys(COUNTRY_GEO_COORDINATES).find(k => k.includes(query));
    if (coordMatchKey) {
      const geo = COUNTRY_GEO_COORDINATES[coordMatchKey];
      const country = REAL_WORLD_COUNTRIES.find(c => c.id === geo.countryId) || REAL_WORLD_COUNTRIES[0];
      handleSelectPlace(country, geo);
      onLogEvent(`Ort gefunden: "${query.toUpperCase()}" zentriert.`, 'neutral');
      return;
    }

    // 3. Fallback to Google Geocoder if available
    if (window.google?.maps?.Geocoder) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: searchQuery }, (results: any, status: any) => {
        if (status === 'OK' && results && results[0]) {
          const loc = results[0].geometry.location;
          const lat = loc.lat();
          const lng = loc.lng();

          // Pick nearest country or default
          const defaultC = REAL_WORLD_COUNTRIES[0];

          if (mapInstanceRef.current) {
            mapInstanceRef.current.panTo({ lat, lng });
            mapInstanceRef.current.setZoom(8);

            if (activePinMarkerRef.current) {
              activePinMarkerRef.current.setMap(null);
            }

            const pinMarker = new google.maps.Marker({
              position: { lat, lng },
              map: mapInstanceRef.current,
              title: results[0].formatted_address,
              animation: google.maps.Animation.DROP
            });
            activePinMarkerRef.current = pinMarker;

            if (infoWindowRef.current) {
              infoWindowRef.current.setContent(`
                <div style="font-family: sans-serif; padding: 4px;">
                  <strong>${results[0].formatted_address}</strong>
                  <p style="font-size: 11px; color: #475569; margin-top: 4px;">Geographische Position angeflogen.</p>
                </div>
              `);
              infoWindowRef.current.open(mapInstanceRef.current, pinMarker);
            }

            sound.playPin();
            onLogEvent(`Ort geortet: ${results[0].formatted_address}`, 'positive');
          }
        } else {
          onLogEvent(`Ort "${searchQuery}" konnte nicht gefunden werden.`, 'warning');
          sound.playCrisis();
        }
      });
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-950 overflow-hidden select-none">
      
      {/* Top Banner: Google Maps Info & DrawOnAMap Link */}
      <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-2.5 bg-slate-900/95 border-b border-slate-800 text-xs shrink-0 gap-2">
        <div className="flex items-center gap-2.5 text-slate-200">
          <Globe className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="font-['Cinzel'] font-bold text-white tracking-wider text-xs sm:text-sm">
            ECHTE INTERAKTIVE WELTKARTE · GOOGLE MAPS JAVASCRIPT API
          </span>
          <span className="text-slate-500 hidden xl:inline">· Scrollbar, zoombar, Flug-Animation (Smooth Pan) & interaktive Pins</span>
        </div>

        {/* Right Action Ribbon: DrawOnAMap external & embed */}
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <a
            href="https://drawonamap.com/de/world-map/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-colors shadow-sm font-semibold cursor-pointer"
            title="Echte Weltkarte auf drawonamap.com im neuen Tab öffnen"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>DrawOnAMap.com</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>

          <button
            onClick={() => setIsDrawOnMapEmbedOpen(prev => !prev)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
            title="DrawOnAMap direkt einbetten"
          >
            {isDrawOnMapEmbedOpen ? 'Embed schließen' : 'DrawOnAMap Embed'}
          </button>
        </div>
      </div>

      {/* Floating Search Field & View Style Controls */}
      <div className="absolute top-14 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        
        {/* Search Field (Smooth Pan on found) */}
        <form
          onSubmit={handleSearchSubmit}
          className="pointer-events-auto flex items-center shadow-xl rounded-xl overflow-hidden bg-slate-950/90 backdrop-blur-md border border-amber-500/40 w-full sm:w-96"
        >
          <div className="pl-3 text-amber-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Ort, Stadt oder Land suchen (z.B. Berlin, Washington, Paris, Tokio)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 text-xs text-white placeholder-slate-400 bg-transparent focus:outline-none font-sans"
          />
          <button
            type="submit"
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shrink-0 cursor-pointer"
          >
            Suchen & Anfliegen
          </button>
        </form>

        {/* Map Style Selector */}
        <div className="pointer-events-auto flex items-center gap-1 p-1 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 shadow-xl font-mono text-[11px]">
          <button
            onClick={() => handleChangeMapType('dark')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              activeMapType === 'dark' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Krisenzentrum
          </button>
          <button
            onClick={() => handleChangeMapType('satellite')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              activeMapType === 'satellite' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Satellit
          </button>
          <button
            onClick={() => handleChangeMapType('hybrid')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              activeMapType === 'hybrid' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Hybrid
          </button>
          <button
            onClick={() => handleChangeMapType('roadmap')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              activeMapType === 'roadmap' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Standard
          </button>
        </div>

      </div>

      {/* Main Map Viewport */}
      <div className="relative flex-1 w-full h-full">
        {/* Google Maps Container */}
        <div ref={mapContainerRef} className="w-full h-full bg-[#0a0f1d]" />

        {/* Load Error Fallback Warning */}
        {loadError && (
          <div className="absolute inset-0 flex items-center justify-center p-6 bg-slate-950/90 z-30">
            <div className="max-w-md p-6 rounded-2xl bg-slate-900 border border-rose-500/40 text-center space-y-3">
              <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
              <h4 className="font-bold text-white text-base">Google Maps Initialisierung</h4>
              <p className="text-xs text-slate-300">{loadError}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
              >
                Erneut laden
              </button>
            </div>
          </div>
        )}

        {/* Optional DrawOnAMap Direct Embedded Iframe */}
        {isDrawOnMapEmbedOpen && (
          <div className="absolute inset-4 z-40 rounded-2xl overflow-hidden bg-slate-950 border border-amber-500/40 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-300">
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-amber-400" />
                DrawOnAMap.com Embedded Viewer
              </span>
              <button
                onClick={() => setIsDrawOnMapEmbedOpen(false)}
                className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white"
              >
                Schließen
              </button>
            </div>
            <iframe
              src="https://drawonamap.com/de/world-map/"
              className="w-full flex-1 border-0"
              title="DrawOnAMap Weltkarte"
            />
          </div>
        )}

        {/* Bottom Geopolitical Control Card for Selected Country */}
        {selectedPinCountry && (
          <div className="absolute bottom-4 left-4 right-4 z-20 max-w-4xl mx-auto p-4 rounded-2xl bg-slate-950/95 backdrop-blur-md border border-amber-500/50 shadow-2xl shadow-black/80 text-white font-sans">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full border border-white"
                  style={{ backgroundColor: selectedPinCountry.flagColor }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white tracking-wide">
                      {selectedPinCountry.name}
                    </h3>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-bold">
                      {selectedPinCountry.isoCode} · {selectedPinCountry.capital}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    BIP: ${selectedPinCountry.gdpBillions} Mrd. · Schulden: ${getCountryDebtBillions(selectedPinCountry)} Mrd. · Militär: {selectedPinCountry.militaryScore}/100
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedPinCountry(null)}
                className="text-xs text-slate-400 hover:text-white font-mono"
              >
                Schließen ✕
              </button>
            </div>

            {/* Direct Action Buttons matching user specifications */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 font-mono text-xs">
              
              {/* 1. Kriegszustand erklären */}
              <button
                onClick={() => onOpenWarSimulator(selectedPinCountry)}
                className="p-2.5 rounded-xl bg-gradient-to-r from-rose-700 to-rose-600 hover:from-rose-600 hover:to-rose-500 text-white font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-rose-950/50 cursor-pointer text-center"
              >
                <Swords className="w-3.5 h-3.5" />
                <span>Kriegszustand erklären</span>
              </button>

              {/* 2. Wirtschaftsembargo & 30 Sanktionen */}
              <button
                onClick={() => onOpenSanctions(selectedPinCountry)}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-rose-500/40 text-rose-300 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>30 Sanktionen</span>
              </button>

              {/* 3. Investieren (Top 15 & Staat / Offshore) */}
              <button
                onClick={() => onOpenInvestments(selectedPinCountry)}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-amber-300 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center"
              >
                <Building className="w-3.5 h-3.5 text-amber-400" />
                <span>Investieren (Top 15)</span>
              </button>

              {/* 4. Geld an Land verleihen (Kredit) */}
              <button
                onClick={() => onOpenLending(selectedPinCountry)}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-sky-500/40 text-sky-300 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center"
              >
                <Landmark className="w-3.5 h-3.5 text-sky-400" />
                <span>Geld verleihen</span>
              </button>

            </div>
          </div>
        )}

      </div>

    </div>
  );
};
