import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Calendar } from 'lucide-react';

export const InteractiveMap = ({ events, onSelectEvent }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize Map if not initialized
    if (!mapInstanceRef.current) {
      const defaultCenter = [19.0760, 72.8777]; // Mumbai center default
      const map = L.map(mapRef.current, {
        center: defaultCenter,
        zoom: 6,
        zoomControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Custom Icon Generator
    const createCustomIcon = (category) => {
      let color = '#10B981'; // emerald
      if (category === 'Blood Donation') color = '#EF4444';
      if (category === 'Cleanliness Drives') color = '#0D9488';
      if (category === 'Education') color = '#6366F1';
      if (category === 'Disaster Relief') color = '#8B5CF6';

      return L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            background-color: ${color};
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 14px;
          ">
            📍
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -28]
      });
    };

    const bounds = L.latLngBounds();
    let hasCoords = false;

    events.forEach(evt => {
      if (evt.coordinates && evt.coordinates.lat && evt.coordinates.lng) {
        const marker = L.marker([evt.coordinates.lat, evt.coordinates.lng], {
          icon: createCustomIcon(evt.category)
        }).addTo(map);

        bounds.extend([evt.coordinates.lat, evt.coordinates.lng]);
        hasCoords = true;

        // Custom Popup Content
        const popupContainer = document.createElement('div');
        popupContainer.className = 'p-2 max-w-xs space-y-2';
        popupContainer.innerHTML = `
          <img src="${evt.bannerUrl}" alt="${evt.title}" class="w-full h-24 object-cover rounded-lg mb-2" />
          <span class="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">${evt.category}</span>
          <h4 class="font-bold text-xs text-slate-900 line-clamp-1">${evt.title}</h4>
          <p class="text-[11px] text-slate-600">📅 ${evt.date} | 📍 ${evt.city || evt.location}</p>
          <button id="pop-btn-${evt.id}" class="w-full py-1 text-[11px] font-bold bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors mt-2">
            View Drive Details
          </button>
        `;

        marker.bindPopup(popupContainer);

        // Add event listener to popup button
        marker.on('popupopen', () => {
          const btn = document.getElementById(`pop-btn-${evt.id}`);
          if (btn) {
            btn.onclick = () => onSelectEvent(evt);
          }
        });
      }
    });

    if (hasCoords && events.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
    }

  }, [events]);

  return (
    <div className="relative w-full h-[450px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md">
      <div ref={mapRef} className="w-full h-full z-10" />
      
      {/* Legend overlay */}
      <div className="absolute bottom-3 left-3 z-20 glass-panel p-2.5 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-800 text-xs space-y-1">
        <div className="font-bold text-[11px] text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Drive Locations</div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
          <span>Green Plantation</span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
          <span>Blood Donation</span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="w-3 h-3 rounded-full bg-teal-500 inline-block"></span>
          <span>Cleanliness Drives</span>
        </div>
      </div>
    </div>
  );
};
