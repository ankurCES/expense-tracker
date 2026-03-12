import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDocument = await loadingTask.promise;
  
  let fullText = '';
  
  for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
    const page = await pdfDocument.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageStrings = textContent.items.map((item: any) => item.str);
    fullText += pageStrings.join(' ') + '\n';
  }
  
  return fullText;
}

// Convert PDF page to Image Base64 (Useful for Vision Models if needed)
export async function convertPdfToImageBase64(file: File): Promise<string[]> {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDocument = await loadingTask.promise;
    
    const images: string[] = [];
    
    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
        const page = await pdfDocument.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 });
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        // @ts-ignore
        await page.render({ canvasContext: ctx, viewport: viewport }).promise;
        
        // Strip out the data:image/png;base64, prefix for Ollama
        const base64 = canvas.toDataURL('image/png').split(',')[1];
        if (base64) images.push(base64);
    }
    
    return images;
}
