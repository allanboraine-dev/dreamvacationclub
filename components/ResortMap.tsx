import React from 'react';

interface ResortMapProps {
  onSelectProvince: (province: string | null) => void;
  selectedProvince: string | null;
  availability: Record<string, number>; // e.g., { 'Western Cape': 4, 'KwaZulu-Natal': 5 }
}

const ResortMap: React.FC<ResortMapProps> = ({ onSelectProvince, selectedProvince, availability }) => {
  
  // Helper to determine fill color
  const getFillColor = (provinceName: string) => {
    const count = availability[provinceName] || 0;
    const isSelected = selectedProvince === provinceName;

    if (isSelected) return '#f59e0b'; // Amber 500
    if (count > 0) return '#fbbf24'; // Amber 400
    return '#e2e8f0'; // Slate 200 (Inactive)
  };

  const getHoverClass = (provinceName: string) => {
     const count = availability[provinceName] || 0;
     return count > 0 ? 'cursor-pointer hover:opacity-80 transition-opacity' : 'cursor-default';
  };

  return (
    <div className="w-full h-auto aspect-[4/3] relative">
      <svg
        viewBox="0 0 800 600"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl"
      >
        <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
        </defs>

        {/* NORTHERN CAPE */}
        <path
            d="M170,300 L200,280 L250,290 L280,260 L320,270 L340,320 L320,380 L250,400 L200,380 L160,350 Z"
            fill={getFillColor('Northern Cape')}
            stroke="white"
            strokeWidth="2"
            className={getHoverClass('Northern Cape')}
            onClick={() => availability['Northern Cape'] && onSelectProvince('Northern Cape')}
        />

        {/* WESTERN CAPE */}
        <path
            d="M160,350 L200,380 L250,400 L320,380 L350,420 L320,480 L280,520 L200,500 L150,450 Z"
            fill={getFillColor('Western Cape')}
            stroke="white"
            strokeWidth="2"
            className={getHoverClass('Western Cape')}
            onClick={() => availability['Western Cape'] && onSelectProvince('Western Cape')}
        />

        {/* EASTERN CAPE */}
        <path
            d="M320,380 L340,320 L400,340 L440,360 L460,420 L420,480 L350,480 L350,420 Z"
            fill={getFillColor('Eastern Cape')}
            stroke="white"
            strokeWidth="2"
            className={getHoverClass('Eastern Cape')}
            onClick={() => availability['Eastern Cape'] && onSelectProvince('Eastern Cape')}
        />

        {/* FREE STATE */}
        <path
            d="M340,320 L400,280 L460,260 L480,300 L440,360 L400,340 Z"
            fill={getFillColor('Free State')}
            stroke="white"
            strokeWidth="2"
            className={getHoverClass('Free State')}
            onClick={() => availability['Free State'] && onSelectProvince('Free State')}
        />

        {/* KWAZULU-NATAL */}
        <path
            d="M480,300 L520,280 L560,300 L540,380 L460,420 L440,360 Z"
            fill={getFillColor('KwaZulu-Natal')}
            stroke="white"
            strokeWidth="2"
            className={getHoverClass('KwaZulu-Natal')}
            onClick={() => availability['KwaZulu-Natal'] && onSelectProvince('KwaZulu-Natal')}
        />

        {/* NORTH WEST */}
        <path
            d="M320,270 L360,220 L420,210 L440,240 L400,280 L340,320 Z"
            fill={getFillColor('North West')}
            stroke="white"
            strokeWidth="2"
            className={getHoverClass('North West')}
            onClick={() => availability['North West'] && onSelectProvince('North West')}
        />

        {/* GAUTENG */}
        <path
            d="M440,240 L460,230 L480,250 L460,260 Z"
            fill={getFillColor('Gauteng')}
            stroke="white"
            strokeWidth="2"
            className={getHoverClass('Gauteng')}
            onClick={() => availability['Gauteng'] && onSelectProvince('Gauteng')}
        />

        {/* MPUMALANGA */}
        <path
            d="M460,230 L520,200 L560,240 L560,300 L520,280 L480,300 L460,260 L480,250 Z"
            fill={getFillColor('Mpumalanga')}
            stroke="white"
            strokeWidth="2"
            className={getHoverClass('Mpumalanga')}
            onClick={() => availability['Mpumalanga'] && onSelectProvince('Mpumalanga')}
        />

        {/* LIMPOPO */}
        <path
            d="M420,210 L480,140 L560,160 L560,240 L520,200 L460,230 L440,240 L360,220 Z"
            fill={getFillColor('Limpopo')}
            stroke="white"
            strokeWidth="2"
            className={getHoverClass('Limpopo')}
            onClick={() => availability['Limpopo'] && onSelectProvince('Limpopo')}
        />
        
        {/* Labels (Simplified) */}
        {availability['Western Cape'] > 0 && <text x="220" y="450" fontSize="14" fill="#1e293b" fontWeight="bold">WC</text>}
        {availability['KwaZulu-Natal'] > 0 && <text x="500" y="340" fontSize="14" fill="#1e293b" fontWeight="bold">KZN</text>}
        {availability['Mpumalanga'] > 0 && <text x="500" y="250" fontSize="14" fill="#1e293b" fontWeight="bold">MP</text>}
        {availability['Limpopo'] > 0 && <text x="480" y="180" fontSize="14" fill="#1e293b" fontWeight="bold">LP</text>}
        {availability['North West'] > 0 && <text x="380" y="250" fontSize="14" fill="#1e293b" fontWeight="bold">NW</text>}
        {availability['Eastern Cape'] > 0 && <text x="380" y="420" fontSize="14" fill="#1e293b" fontWeight="bold">EC</text>}

      </svg>
      
      {/* Legend / Tip */}
      <div className="absolute bottom-2 right-2 bg-white/80 dark:bg-navy-900/80 backdrop-blur px-3 py-1.5 rounded-lg text-[10px] shadow-sm border border-slate-200 dark:border-navy-700">
         <div className="flex items-center gap-2 mb-1">
             <span className="w-2 h-2 rounded-full bg-amber-400"></span>
             <span>Available Resorts</span>
         </div>
         <div className="flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-slate-200"></span>
             <span>No Inventory</span>
         </div>
      </div>
    </div>
  );
};

export default ResortMap;