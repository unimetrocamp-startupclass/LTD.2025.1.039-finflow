import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { CryptoManager } from '../models/CryptoManager';

interface CryptoViewerProps {
  onClose: () => void;
  rawData: string;
}

export function CryptoViewer({ onClose, rawData }: CryptoViewerProps) {
  const [decryptedData, setDecryptedData] = useState<string>('');

  useEffect(() => {
    const decryptData = async () => {
      try {
        if (rawData) {
          const decrypted = await CryptoManager.decrypt(rawData);
          setDecryptedData(decrypted);
        }
      } catch (error) {
        console.error('Erro ao descriptografar:', error);
        setDecryptedData('Erro ao descriptografar os dados');
      }
    };

    decryptData();
  }, [rawData]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-6xl mx-4 h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Visualizador de Criptografia
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-4 overflow-hidden">
          {/* Dados Criptografados */}
          <div className="flex flex-col h-full">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dados Criptografados
            </h3>
            <div className="flex-1 bg-gray-100 dark:bg-gray-900 rounded-lg p-4 overflow-auto">
              <pre className="text-sm text-gray-800 dark:text-gray-200 font-mono whitespace-pre-wrap">
                {rawData || 'Nenhum dado criptografado encontrado'}
              </pre>
            </div>
          </div>

          {/* Dados Descriptografados */}
          <div className="flex flex-col h-full">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dados Descriptografados
            </h3>
            <div className="flex-1 bg-gray-100 dark:bg-gray-900 rounded-lg p-4 overflow-auto">
              <pre className="text-sm text-gray-800 dark:text-gray-200 font-mono whitespace-pre-wrap">
                {decryptedData ? JSON.stringify(JSON.parse(decryptedData), null, 2) : 'Nenhum dado descriptografado'}
              </pre>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}