import { NextResponse } from 'next/server';

export function proxy(request) {
    // Only protect /admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        const authCookie = request.cookies.get('mflower_admin_auth');
        
        // If authenticated, allow through
        if (authCookie && authCookie.value === 'authenticated') {
            return NextResponse.next();
        }

        // Check if this is the login attempt (POST to /admin with password in URL)
        const loginPassword = request.nextUrl.searchParams.get('pw');
        const adminPassword = process.env.ADMIN_PASSWORD || 'mflower2026';

        if (loginPassword === adminPassword) {
            // Set auth cookie and redirect to clean URL
            const url = request.nextUrl.clone();
            url.searchParams.delete('pw');
            const response = NextResponse.redirect(url);
            response.cookies.set('mflower_admin_auth', 'authenticated', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7, // 7 days
                path: '/'
            });
            return response;
        }

        // Show a simple login page
        const html = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>M•flower Admin - Login</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #F9FAFB;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .login-card {
            background: white;
            padding: 3rem 2.5rem;
            border-radius: 32px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.06);
            border: 1px solid #F3F4F6;
            width: 100%;
            max-width: 400px;
            text-align: center;
        }
        .logo-icon {
            width: 56px; height: 56px;
            background: #D47792;
            border-radius: 16px;
            color: white;
            display: flex; align-items: center; justify-content: center;
            font-weight: 900; font-size: 1.5rem;
            margin: 0 auto 1.5rem;
        }
        h1 { font-size: 1.5rem; font-weight: 900; color: #111827; margin-bottom: 0.5rem; }
        p { color: #6B7280; font-size: 0.9rem; margin-bottom: 2rem; }
        input {
            width: 100%;
            padding: 16px 20px;
            border: 1px solid #F3F4F6;
            border-radius: 16px;
            background: #F9FAFB;
            font-size: 1rem;
            outline: none;
            margin-bottom: 1rem;
            transition: all 0.2s;
        }
        input:focus { border-color: #D47792; background: white; box-shadow: 0 0 0 4px rgba(212,119,146,0.1); }
        button {
            width: 100%;
            padding: 16px;
            background: #111827;
            color: white;
            border: none;
            border-radius: 16px;
            font-weight: 800;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s;
        }
        button:hover { background: #D47792; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(212,119,146,0.2); }
    </style>
</head>
<body>
    <div class="login-card">
        <div class="logo-icon">M</div>
        <h1>M•flower Admin</h1>
        <p>Ingresá la contraseña para acceder al panel de gestión.</p>
        <form onsubmit="event.preventDefault(); window.location.href = window.location.pathname + '?pw=' + encodeURIComponent(document.getElementById('pw').value);">
            <input type="password" id="pw" placeholder="Contraseña" autocomplete="current-password" required />
            <button type="submit">Ingresar</button>
        </form>
    </div>
</body>
</html>`;

        return new NextResponse(html, {
            status: 401,
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*'
};
