import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RegionCascade from '../RegionCascade';

describe('RegionCascade Component', () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([{ id: '11', name: 'ACEH' }])
      })
    );
  });

  it('fetches provinces on mount and renders dropdown', async () => {
    render(<RegionCascade onChange={() => {}} isEditing={true} />);
    
    // Wait for API call
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json');
    });
    
    // It should render the default option
    expect(screen.getByText('-- Pilih Provinsi --')).toBeInTheDocument();
  });
});
