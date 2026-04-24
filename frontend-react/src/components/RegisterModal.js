import React from 'react';
import { X, Mail, Lock, User, Phone } from 'lucide-react';

const RegisterModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-avorio w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-fade-in border border-bronzo/20">
        
        {/* Header con sfondo Antracite */}
        <div className="bg-antracite p-6 flex justify-between items-center border-b-2 border-bronzo">
          <h2 className="text-2xl font-bold text-crema">Crea il tuo Account</h2>
          <button onClick={onClose} className="text-crema hover:text-bronzo transition">
            <X size={24} />
          </button>
        </div>

        {/* Form di Registrazione */}
        <form className="p-8 space-y-5" onClick={(e) => e.stopPropagation()}>
          <div className="relative">
            <User className="absolute left-3 top-3 text-bronzo" size={20} />
            <input type="text" placeholder="Nome Completo" className="w-full pl-10 pr-4 py-2 border-b-2 border-bronzo/30 focus:border-bronzo outline-none bg-transparent transition-colors" />
          </div>
          
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-bronzo" size={20} />
            <input type="email" placeholder="Email" className="w-full pl-10 pr-4 py-2 border-b-2 border-bronzo/30 focus:border-bronzo outline-none bg-transparent transition-colors" />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-bronzo" size={20} />
            <input type="password" placeholder="Password" className="w-full pl-10 pr-4 py-2 border-b-2 border-bronzo/30 focus:border-bronzo outline-none bg-transparent transition-colors" />
          </div>

          <div className="relative">
            <Phone className="absolute left-3 top-3 text-bronzo" size={20} />
            <input type="text" placeholder="Telefono" className="w-full pl-10 pr-4 py-2 border-b-2 border-bronzo/30 focus:border-bronzo outline-none bg-transparent transition-colors" />
          </div>

          <button 
            type="button" 
            className="w-full bg-terra hover:bg-bronzo text-white font-bold py-3 rounded-xl shadow-lg transition-all transform active:scale-95 mt-4"
          >
            Registrati ora
          </button>
          
          <p className="text-center text-sm text-gray-500 mt-4">
            Hai già un account? <span className="text-terra font-bold cursor-pointer hover:underline">Accedi</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;