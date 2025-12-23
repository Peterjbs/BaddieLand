'use client';

interface TileAtlasViewerProps {
  atlasUrl: string;
  metadataUrl: string;
}

export default function TileAtlasViewer({ atlasUrl, metadataUrl }: TileAtlasViewerProps) {
  return (
    <div className="card">
      <h3 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>Tile Atlas Preview</h3>
      
      <div className="asset-preview">
        <img src={atlasUrl} alt="Tile Atlas" />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <a 
          href={atlasUrl} 
          download 
          className="button button-full"
          style={{ textDecoration: 'none', textAlign: 'center' }}
        >
          Download PNG
        </a>
        <a 
          href={metadataUrl} 
          download 
          className="button button-secondary button-full"
          style={{ textDecoration: 'none', textAlign: 'center' }}
        >
          Download JSON
        </a>
      </div>
    </div>
  );
}
