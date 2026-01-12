'use client';

export default function Home() {
  return (
    <div style={{
      backgroundColor: 'black',
      color: 'white',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#4ade80' }}>✅ System Recovery Successful</h1>
      <p>앱이 안전 모드로 재설치되었습니다.</p>
      <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#888' }}>
        (잠시 후 정식 버전을 다시 로드합니다...)
      </p>
    </div>
  );
}
