import { QRCodeSVG } from 'qrcode.react';

export function CheckInScanner({ eventId }) {
  const namespace = import.meta.env.VITE_QR_CODE_NAMESPACE || 'swahilipot-event';
  const qrValue = `${namespace}:${eventId}`;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center max-w-sm mx-auto my-6 text-center">
      <div className="p-4 bg-gray-50 rounded-xl mb-6">
        <QRCodeSVG 
          value={qrValue} 
          size={200}
          bgColor={"#ffffff"}
          fgColor={"#0f172a"}
          level={"Q"}
          includeMargin={false}
        />
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2">Event Check-In</h3>
      <p className="text-sm text-gray-500 mb-6">Ask members to scan this QR code with their mobile device to confirm attendance.</p>
      
      <div className="w-full relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm font-medium leading-6">
          <span className="bg-white px-6 text-gray-500 text-xs uppercase tracking-widest">Or</span>
        </div>
      </div>
      
      <button className="mt-6 w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg shadow-sm transition-colors text-sm">
        Manual Entry
      </button>
    </div>
  );
}
