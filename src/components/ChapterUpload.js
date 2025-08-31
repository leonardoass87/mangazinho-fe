"use client";
import { useState } from 'react';

export default function ChapterUpload({ mangaId, onUpload, onClose }) {
  const [step, setStep] = useState(1);
  const [chapterData, setChapterData] = useState({
    number: '',
    title: ''
  });
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== files.length) {
      setError('Apenas arquivos de imagem são permitidos');
      return;
    }

    // Ordenar arquivos por nome
    const sortedFiles = imageFiles.sort((a, b) => {
      const aNum = parseInt(a.name.match(/\d+/)?.[0] || '0');
      const bNum = parseInt(b.name.match(/\d+/)?.[0] || '0');
      return aNum - bNum;
    });

    setPages(sortedFiles);
    setError('');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== files.length) {
      setError('Apenas arquivos de imagem são permitidos');
      return;
    }

    const sortedFiles = imageFiles.sort((a, b) => {
      const aNum = parseInt(a.name.match(/\d+/)?.[0] || '0');
      const bNum = parseInt(b.name.match(/\d+/)?.[0] || '0');
      return aNum - bNum;
    });

    setPages(sortedFiles);
    setError('');
  };

  const removePage = (index) => {
    setPages(pages.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!chapterData.number || pages.length === 0) {
      setError('Preencha o número do capítulo e selecione as páginas');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onUpload(mangaId, chapterData.number, chapterData.title, pages);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && (!chapterData.number || !chapterData.title)) {
      setError('Preencha todos os campos');
      return;
    }
    setStep(step + 1);
    setError('');
  };

  const prevStep = () => {
    setStep(step - 1);
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Upload de Capítulo</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex mb-6">
          <div className={`flex-1 text-center py-2 ${step >= 1 ? 'text-blue-400' : 'text-gray-500'}`}>
            1. Dados do Capítulo
          </div>
          <div className={`flex-1 text-center py-2 ${step >= 2 ? 'text-blue-400' : 'text-gray-500'}`}>
            2. Selecionar Páginas
          </div>
          <div className={`flex-1 text-center py-2 ${step >= 3 ? 'text-blue-400' : 'text-gray-500'}`}>
            3. Confirmar
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded text-red-200 text-sm">
            {error}
          </div>
        )}

        {/* Step 1: Chapter Data */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Número do Capítulo</label>
              <input
                type="number"
                value={chapterData.number}
                onChange={(e) => setChapterData({...chapterData, number: e.target.value})}
                className="w-full bg-black/30 border border-white/20 rounded px-3 py-2"
                placeholder="Ex: 1"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Título (opcional)</label>
              <input
                type="text"
                value={chapterData.title}
                onChange={(e) => setChapterData({...chapterData, title: e.target.value})}
                className="w-full bg-black/30 border border-white/20 rounded px-3 py-2"
                placeholder="Ex: O início da jornada"
              />
            </div>
          </div>
        )}

        {/* Step 2: Page Selection */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Selecionar Páginas</label>
              
              {/* Drag & Drop Area */}
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors"
              >
                <div className="text-gray-400 mb-4">
                  📄 Arraste as páginas aqui ou clique para selecionar
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="page-upload"
                />
                <label
                  htmlFor="page-upload"
                  className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded cursor-pointer transition"
                >
                  Escolher Arquivos
                </label>
              </div>

              {/* Selected Files */}
              {pages.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">
                    {pages.length} página(s) selecionada(s):
                  </h4>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {pages.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-700 p-2 rounded">
                        <span className="text-sm truncate">{file.name}</span>
                        <button
                          onClick={() => removePage(index)}
                          className="text-red-400 hover:text-red-300 ml-2"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-gray-700 p-4 rounded">
              <h4 className="font-medium mb-2">Resumo do Capítulo</h4>
              <div className="text-sm space-y-1">
                <div><strong>Número:</strong> {chapterData.number}</div>
                {chapterData.title && <div><strong>Título:</strong> {chapterData.title}</div>}
                <div><strong>Páginas:</strong> {pages.length} arquivo(s)</div>
              </div>
            </div>

            <div className="text-sm text-gray-300">
              <p>⚠️ Confirme se todas as informações estão corretas antes de fazer o upload.</p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Anterior
          </button>

          {step < 3 ? (
            <button
              onClick={nextStep}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded transition"
            >
              Próximo
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded disabled:opacity-50 transition"
            >
              {loading ? 'Enviando...' : 'Fazer Upload'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
