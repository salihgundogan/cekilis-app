import React, { useState, useRef } from 'react';
import { X, Upload, Plus, Trash2, Users, Gift, CheckCircle } from 'lucide-react';
import { parseExcelFile } from '../utils/excelParser';

export default function SettingsModal({ 
  onClose, 
  raffleState 
}) {
  const [activeTab, setActiveTab] = useState('participants'); // 'participants' or 'prizes'
  const [newPrize, setNewPrize] = useState('');
  const [uploadStatus, setUploadStatus] = useState(null); // null, 'loading', 'success', 'error'
  const fileInputRef = useRef(null);

  const {
    originalPersonPool,
    loadPersons,
    originalPrizePool,
    addPrize,
    removePrize
  } = raffleState;

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadStatus('loading');
    try {
      const participants = await parseExcelFile(file);
      if (participants.length > 0) {
        loadPersons(participants);
        setUploadStatus('success');
      } else {
        setUploadStatus('error');
        alert("Geçerli katılımcı bulunamadı. Lütfen B sütununun dolu olduğundan emin olun.");
      }
    } catch (error) {
      console.error(error);
      setUploadStatus('error');
      alert("Dosya okunurken bir hata oluştu. Lütfen geçerli bir .xlsx dosyası yükleyin.");
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddPrize = (e) => {
    e.preventDefault();
    if (newPrize.trim()) {
      addPrize(newPrize.trim());
      setNewPrize('');
    }
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="glass-panel modal-content animate-pop-in" onClick={e => e.stopPropagation()}>
        
        <div className="modal-header">
          <h2 className="section-title" style={{ fontSize: '1.25rem', marginBottom: 0 }}>
            Ayarlar
          </h2>
          <button className="btn btn-secondary" style={{ padding: '8px' }} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="tabs">
            <button 
              className={`tab-btn ${activeTab === 'participants' ? 'active' : ''}`}
              onClick={() => setActiveTab('participants')}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Users size={18} />
                Katılımcı Listesi
              </div>
            </button>
            <button 
              className={`tab-btn ${activeTab === 'prizes' ? 'active' : ''}`}
              onClick={() => setActiveTab('prizes')}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Gift size={18} />
                Ödül Listesi
              </div>
            </button>
          </div>

          {activeTab === 'participants' && (
            <div className="animate-fade-in">
              <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '0.9rem' }}>
                A sütununda sıra numarası, B sütununda isimlerin olduğu bir .xlsx dosyası yükleyin.
              </p>
              
              <div className="file-upload-area" onClick={() => fileInputRef.current?.click()}>
                <input 
                  type="file" 
                  accept=".xlsx, .xls" 
                  className="file-input" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />
                
                {uploadStatus === 'loading' ? (
                  <div className="text-gradient animate-pulse" style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                    Yükleniyor...
                  </div>
                ) : uploadStatus === 'success' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <CheckCircle size={48} color="#10b981" />
                    <div>
                      <span style={{ fontSize: '1.2rem', fontWeight: 600, color: '#10b981' }}>Başarılı!</span>
                      <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
                        {originalPersonPool.length} katılımcı yüklendi. (Yeni dosya yüklemek için tıklayın)
                      </p>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <Upload size={48} color="var(--accent-primary)" />
                    <div>
                      <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>Excel Dosyası Yükle</span>
                      <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
                        {originalPersonPool.length > 0 
                          ? `Şu an ${originalPersonPool.length} katılımcı var. Üzerine yazmak için tıklayın.` 
                          : 'Seçmek için tıklayın (.xlsx)'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'prizes' && (
            <div className="animate-fade-in">
              <form onSubmit={handleAddPrize} className="input-group">
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Ödül adı girin..." 
                  value={newPrize}
                  onChange={(e) => setNewPrize(e.target.value)}
                />
                <button type="submit" className="btn btn-primary" disabled={!newPrize.trim()}>
                  <Plus size={18} />
                  Ekle
                </button>
              </form>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>
                  Eklenen Ödüller ({originalPrizePool.length})
                </span>
              </div>

              <div className="list-container">
                {originalPrizePool.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Henüz ödül eklenmedi.
                  </div>
                ) : (
                  originalPrizePool.map((prize, index) => (
                    <div key={index} className="list-item">
                      <span>{prize}</span>
                      <button 
                        className="btn btn-danger" 
                        style={{ padding: '6px', borderRadius: '6px' }}
                        onClick={() => removePrize(index)}
                        title="Sil"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
