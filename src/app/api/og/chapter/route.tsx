import { ImageResponse } from 'next/og';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const numberStr = searchParams.get('number');
    
    if (!numberStr) {
      return new Response('Missing chapter number', { status: 400 });
    }

    const number = parseInt(numberStr, 10);
    
    // Fetch chapter info
    const chapter = await prisma.chapter.findUnique({
      where: { number }
    });

    if (!chapter) {
      return new Response('Chapter not found', { status: 404 });
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            backgroundColor: '#0d0d12',
            backgroundImage: 'radial-gradient(circle at 70% 30%, #7F77DD 0%, transparent 60%)',
            padding: '80px',
            fontFamily: 'monospace',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px 16px',
              borderRadius: '20px',
              border: '1px solid #7F77DD',
              backgroundColor: 'rgba(127, 119, 221, 0.1)',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#7F77DD',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '30px',
            }}
          >
            Chapter {chapter.number} Node
          </div>
          
          <div
            style={{
              fontSize: '64px',
              fontWeight: '900',
              color: '#ffffff',
              textTransform: 'uppercase',
              letterSpacing: '-2px',
              marginBottom: '20px',
            }}
          >
            {chapter.title}
          </div>

          <div
            style={{
              fontSize: '22px',
              color: '#a1a1aa',
              maxWidth: '800px',
              lineHeight: '1.6',
              borderLeft: '4px solid #7F77DD',
              paddingLeft: '24px',
            }}
          >
            {chapter.lore}
          </div>

          <div
            style={{
              display: 'flex',
              position: 'absolute',
              bottom: '50px',
              right: '80px',
              color: '#71717a',
              fontSize: '14px',
              letterSpacing: '1px',
            }}
          >
            CODEQUEST AI GRID // SECTOR_{chapter.number}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error(e);
    return new Response('Failed to generate image', { status: 500 });
  }
}
