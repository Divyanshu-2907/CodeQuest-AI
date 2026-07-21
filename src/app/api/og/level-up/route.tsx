import { ImageResponse } from 'next/og';

export function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const level = searchParams.get('level') || '1';
    const username = searchParams.get('username') || 'Agent';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0d0d12',
            backgroundImage: 'radial-gradient(circle at 50% 50%, #7F77DD 0%, transparent 70%)',
            fontFamily: 'monospace',
            position: 'relative',
          }}
        >
          {/* Cybernetic borders */}
          <div
            style={{
              position: 'absolute',
              top: '40px',
              left: '40px',
              right: '40px',
              bottom: '40px',
              border: '2px solid rgba(127, 119, 221, 0.3)',
              borderRadius: '16px',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#7F77DD',
              letterSpacing: '5px',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}
          >
            Prestige Clearance Verified
          </div>

          <div
            style={{
              fontSize: '48px',
              fontWeight: '900',
              color: '#ffffff',
              marginBottom: '10px',
              textTransform: 'uppercase',
            }}
          >
            @{username}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#1E1E2A',
              border: '3px solid #7F77DD',
              borderRadius: '50%',
              width: '160px',
              height: '160px',
              boxShadow: '0 0 40px rgba(127, 119, 221, 0.6)',
              marginBottom: '30px',
            }}
          >
            <span
              style={{
                fontSize: '64px',
                fontWeight: '900',
                color: '#ffffff',
              }}
            >
              {level}
            </span>
          </div>

          <div
            style={{
              fontSize: '20px',
              color: '#a1a1aa',
              fontWeight: 'bold',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}
          >
            Rank: Neural Architect (Level {level})
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: '60px',
              color: '#71717a',
              fontSize: '12px',
              letterSpacing: '1px',
            }}
          >
            CODEQUEST AI SECURE GATEWAY SYNC
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
    return new Response('Failed to generate level up image', { status: 500 });
  }
}
