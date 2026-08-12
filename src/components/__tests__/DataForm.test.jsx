import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DataForm from '../DataForm';

// Mock child components
vi.mock('../RegionCascade', () => ({
  default: ({ onChange }) => (
    <div data-testid="region-cascade">
      <button onClick={() => onChange({ Provinsi: 'Jawa Barat', Kabupaten: 'Bandung', Kecamatan: 'Coblong', Kelurahan: 'Dago' })}>
        Simulate Region Select
      </button>
    </div>
  )
}));

describe('DataForm Component', () => {
  it('renders form and switches to edit mode', () => {
    const handleSave = vi.fn();
    render(<DataForm user={{ Nama: 'Test User' }} activeTab="biodata" onSave={handleSave} isSaving={false} />);
    
    // Check initial render (readonly mode should show the user's name in a text block)
    // Actually the display logic is complex, we just check if Edit Data button is there
    const editBtn = screen.getByText('Edit Data');
    expect(editBtn).toBeInTheDocument();
    
    // Click edit
    fireEvent.click(editBtn);
    expect(screen.getByText('Simpan Perubahan')).toBeInTheDocument();
  });

  it('hides fields and auto-fills data when Status Ayah is Sudah Wafat', () => {
    const handleSave = vi.fn();
    const { container } = render(<DataForm user={{}} activeTab="orangtua" onSave={handleSave} isSaving={false} />);
    
    // Enable edit mode
    fireEvent.click(screen.getByText('Edit Data'));
    
    // Select 'Sudah Wafat' for Status Ayah
    const statusSelect = container.querySelector('select[name="Status Ayah"]');
    fireEvent.change(statusSelect, { target: { name: 'Status Ayah', value: 'Sudah Wafat' } });
    
    // Check if the related fields are hidden (not in document)
    expect(container.querySelector('select[name="Pekerjaanayah"]')).not.toBeInTheDocument();
    expect(container.querySelector('select[name="Jenjang Pendidikan ayah"]')).not.toBeInTheDocument();
    
    // Submit form
    fireEvent.click(screen.getByText('Simpan Perubahan'));
    
    // Expect onSave to be called with modified data
    expect(handleSave).toHaveBeenCalledWith(
      expect.objectContaining({
        'Status Ayah': 'Sudah Wafat',
        'Pekerjaanayah': 'Sudah Meninggal',
        'Penghasilan ayah': 'Tidak Berpenghasilan',
        'Jenjang Pendidikan ayah': 'Tidak Sekolah'
      }),
      'orangtua'
    );
  });
});
