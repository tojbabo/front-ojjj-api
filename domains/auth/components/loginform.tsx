export default function LoginPage() {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');
  
          * { margin: 0; padding: 0; box-sizing: border-box; }
  
          :root {
            --bg: #0e0e0e;
            --surface: #181818;
            --border: #2a2a2a;
            --text: #f0ece4;
            --muted: #6b6560;
            --accent: #c9a96e;
          }
  
          body {
            background: var(--bg);
            color: var(--text);
            font-family: 'DM Sans', sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
  
          .wrapper {
            display: grid;
            grid-template-columns: 1fr 1fr;
            width: 900px;
            min-height: 560px;
            border: 1px solid var(--border);
          }
  
          /* 왼쪽 패널 */
          .left {
            background: var(--surface);
            padding: 60px 52px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            border-right: 1px solid var(--border);
            position: relative;
            overflow: hidden;
          }
  
          .left::before {
            content: '';
            position: absolute;
            top: -80px; right: -80px;
            width: 260px; height: 260px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(201,169,110,0.12), transparent 70%);
            pointer-events: none;
          }
  
          .logo {
            font-family: 'DM Serif Display', serif;
            font-size: 22px;
            letter-spacing: 0.04em;
            color: var(--accent);
          }
  
          .tagline {
            font-family: 'DM Serif Display', serif;
            font-size: 36px;
            line-height: 1.25;
            color: var(--text);
          }
  
          .tagline em {
            font-style: italic;
            color: var(--accent);
          }
  
          .caption {
            font-size: 13px;
            color: var(--muted);
            line-height: 1.7;
          }
  
          /* 오른쪽 패널 */
          .right {
            background: var(--bg);
            padding: 60px 52px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 28px;
          }
  
          .right h2 {
            font-family: 'DM Serif Display', serif;
            font-size: 26px;
            font-weight: 400;
          }
  
          .field {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
  
          label {
            font-size: 11px;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: var(--muted);
          }
  
          input {
            background: transparent;
            border: none;
            border-bottom: 1px solid var(--border);
            color: var(--text);
            font-family: 'DM Sans', sans-serif;
            font-size: 15px;
            padding: 10px 0;
            outline: none;
            transition: border-color 0.2s;
          }
  
          input:focus {
            border-bottom-color: var(--accent);
          }
  
          input::placeholder {
            color: #3a3a3a;
          }
  
          .forgot {
            font-size: 12px;
            color: var(--muted);
            text-decoration: none;
            align-self: flex-end;
            margin-top: -16px;
            transition: color 0.2s;
          }
  
          .forgot:hover { color: var(--accent); }
  
          .btn {
            background: var(--accent);
            color: #0e0e0e;
            border: none;
            padding: 14px;
            font-family: 'DM Sans', sans-serif;
            font-size: 13px;
            font-weight: 500;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            cursor: pointer;
            transition: opacity 0.2s;
          }
  
          .btn:hover { opacity: 0.85; }
  
          .divider {
            display: flex;
            align-items: center;
            gap: 12px;
            color: var(--muted);
            font-size: 11px;
            letter-spacing: 0.08em;
          }
  
          .divider::before, .divider::after {
            content: '';
            flex: 1;
            height: 1px;
            background: var(--border);
          }
  
          .signup {
            font-size: 13px;
            color: var(--muted);
            text-align: center;
          }
  
          .signup a {
            color: var(--accent);
            text-decoration: none;
          }
        `}</style>
  
        <div className="wrapper">
          <div className="left">
            <div className="logo">PORTAL</div>
            <div className="tagline">
              당신의 하루를<br /><em>더 스마트하게</em>
            </div>
            <p className="caption">
              뉴스, 검색, 커뮤니티까지.<br />
              필요한 모든 것이 한 곳에.
            </p>
          </div>
  
          <div className="right">
            <h2>로그인</h2>
  
            <div className="field">
              <label>이메일</label>
              <input type="email" placeholder="hello@example.com" />
            </div>
  
            <div className="field">
              <label>비밀번호</label>
              <input type="password" placeholder="••••••••" />
            </div>
  
            <a href="#" className="forgot">비밀번호를 잊으셨나요?</a>
  
            <button className="btn">로그인</button>
  
            <div className="divider">OR</div>
  
            <p className="signup">
              계정이 없으신가요? <a href="#">회원가입</a>
            </p>
          </div>
        </div>
      </>
    );
  }