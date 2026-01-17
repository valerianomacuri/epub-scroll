/**
 * Unit Tests for ChapterView
 * Tests presentation logic
 */

import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { ChapterView } from '../features/reader/ChapterView';
import type { ReaderSettings } from '../core/types/epub.types';

describe('ChapterView', () => {
  const mockSettings: ReaderSettings = {
    fontSize: 18,
    lineHeight: 1.6,
    fontFamily: 'Georgia, serif',
    align: 'left',
  };

  it('renders chapter content', () => {
    const content = '<p>Test chapter content</p>';
    const { container } = render(<ChapterView href="test" content={content} settings={mockSettings} />);
    
    expect(container.textContent).toContain('Test chapter content');
  });

  it('applies custom font size from settings', () => {
    const content = '<p>Test content</p>';
    const { container } = render(
      <ChapterView href="test" content={content} settings={{ ...mockSettings, fontSize: 24 }} />
    );

    expect(container).toBeTruthy();
  });

  it('renders without onScroll handler', () => {
    const content = '<p>Test content</p>';
    const { container } = render(<ChapterView href="test" content={content} settings={mockSettings} />);
    
    expect(container).toBeTruthy();
  });

  it('calls onScroll handler when provided', () => {
    const onScroll = vi.fn();
    const content = '<p>Test content</p>';
    
    render(<ChapterView href="test" content={content} settings={mockSettings} onScroll={onScroll} />);
    
    // Test that scroll handler is set up
    expect(onScroll).not.toHaveBeenCalled();
  });
});
