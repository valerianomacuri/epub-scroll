/**
 * Chapter View - Presentational Component
 * Single Responsibility: Render chapter content with custom styling
 */

import React, { ReactNode, useEffect, useRef } from 'react';
import type { ReaderSettings } from '../../core/types/epub.types';

interface ChapterViewProps {
  href: string;
  content: string;
  footer?: ReactNode;
  settings: ReaderSettings;
  initialScrollPosition?: number;
  onScroll?: (scrollTop: number) => void;
}

export const ChapterView: React.FC<ChapterViewProps> = ({
  href,
  content,
  footer,
  settings,
  initialScrollPosition,
  onScroll,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!initialScrollPosition) return;
    const element = contentRef.current;
    if (!element) return;
    const timeoutId = setTimeout(() => {
      element.scrollTo({
        top: initialScrollPosition,
      });
    });
    return () => {
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current && onScroll) {
        onScroll(contentRef.current.scrollTop);
      }
    };

    const element = contentRef.current;
    element?.addEventListener('scroll', handleScroll);

    return () => {
      element?.removeEventListener('scroll', handleScroll);
    };
  }, [onScroll]);

  useEffect(() => {
    if (!content) return;
    if (!href) return;
    const element = contentRef.current;
    if (!element) return;
    if (href.includes('#')) {
      const index = href.indexOf('#');
      const hashUrl = href.substring(index);
      element.scrollTop = 0;
      window.location.hash = hashUrl;
      return;
    }
    element.scrollTop = 0;
  }, [content, href]);

  return (
    <div
      id="epub-container-view"
      ref={contentRef}
      className="h-full overflow-auto"
    >
      <div
        className="max-w-2xl mx-auto p-4 md:p-6 [&_p]:text-foreground [&_h1]:text-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_h4]:text-foreground [&_h5]:text-foreground [&_h6]:text-foreground [&_ul]:text-foreground [&_ol]:text-foreground [&_li]:text-foreground [&_blockquote]:text-foreground [&_span]:text-foreground [&_strong]:text-foreground [&_em]:text-foreground [&_i]:text-foreground [&_font]:text-foreground [&_a]:underline [&_a]:no-underline [&_a]:cursor-pointer prose prose-neutral dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      {footer}
    </div>
  );
};
