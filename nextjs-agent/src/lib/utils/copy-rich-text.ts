import { marked } from 'marked';

/**
 * Copy text to clipboard using the legacy execCommand method
 * This is a fallback when the Clipboard API is not available or blocked
 *
 * @param text - The text to copy
 * @param html - Optional HTML content for rich text copying
 * @returns true if copy was successful
 */
function copyWithExecCommand(text: string, html?: string): boolean {
  try {
    // Create a temporary container
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '-9999px';

    // Add both plain text and HTML if provided
    if (html) {
      container.innerHTML = html;
    } else {
      container.textContent = text;
    }

    document.body.appendChild(container);

    // Select the content
    const range = document.createRange();
    range.selectNodeContents(container);
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }

    // Execute copy command
    const success = document.execCommand('copy');

    // Clean up
    document.body.removeChild(container);

    return success;
  } catch (error) {
    console.error('execCommand copy failed:', error);
    return false;
  }
}

/**
 * Copy text to clipboard with rich text formatting (HTML)
 * This enables pasting into Google Docs and other rich text editors with formatting preserved
 *
 * @param markdownText - The markdown text to copy
 * @returns Promise that resolves when copy is successful
 */
export async function copyAsRichText(markdownText: string): Promise<void> {
  // First, try the modern Clipboard API
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.write) {
    try {
      // Convert markdown to HTML using marked
      const html = await marked.parse(markdownText, {
        gfm: true, // Enable GitHub Flavored Markdown
        breaks: true, // Enable line breaks
      });

      // Create a blob with HTML MIME type
      const htmlBlob = new Blob([html], { type: 'text/html' });
      const textBlob = new Blob([markdownText], { type: 'text/plain' });

      // Create ClipboardItem with both HTML and plain text formats
      const clipboardItem = new ClipboardItem({
        'text/html': htmlBlob,
        'text/plain': textBlob,
      });

      // Write to clipboard
      await navigator.clipboard.write([clipboardItem]);
      return; // Success!
    } catch (error) {
      console.warn('Clipboard API failed, trying fallback:', error);
    }
  }

  // Fallback: Try execCommand
  try {
    const html = await marked.parse(markdownText, {
      gfm: true,
      breaks: true,
    });

    const success = copyWithExecCommand(markdownText, html);
    if (!success) {
      throw new Error('execCommand copy failed');
    }
  } catch (error) {
    // Last resort: copy plain text only
    console.warn('Rich text copy failed, copying plain text only:', error);
    const success = copyWithExecCommand(markdownText);
    if (!success) {
      throw new Error('All copy methods failed');
    }
  }
}

/**
 * Copy plain text to clipboard
 *
 * @param text - The plain text to copy
 * @returns Promise that resolves when copy is successful
 */
export async function copyAsPlainText(text: string): Promise<void> {
  // Try modern API first
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch (error) {
      console.warn('Clipboard API writeText failed, trying fallback:', error);
    }
  }

  // Fallback to execCommand
  const success = copyWithExecCommand(text);
  if (!success) {
    throw new Error('Failed to copy text');
  }
}

/**
 * Check if the Clipboard API is supported
 *
 * @returns true if clipboard API is available
 */
export function isClipboardSupported(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    typeof navigator.clipboard !== 'undefined' &&
    typeof navigator.clipboard.write !== 'undefined'
  );
}
