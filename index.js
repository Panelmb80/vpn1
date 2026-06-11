import { connect } from 'cloudflare:sockets';

const userID = 'fb3b1c65-9c8f-4ef0-88bc-68cad2e927c2';
const expireTimestamp = 1783545599; // 2026-07-08T23:59:59Z

export default {
  async fetch(request, env, ctx) {
    const now = Math.floor(Date.now() / 1000);
    if (now > expireTimestamp) {
      return new Response("Subscription Expired", { status: 403 });
    }

    const upgradeHeader = request.headers.get('Upgrade');
    if (!upgradeHeader || upgradeHeader !== 'websocket') {
      const url = new URL(request.url);
      if (url.pathname === "/VIPMidas") {
        const vlessLink = `vless://${userID}@vpn1.vpnkey.workers.dev:443?encryption=none&security=tls&type=ws&host=vpn1.vpnkey.workers.dev&path=/&sni=vpn1.vpnkey.workers.dev#VIPMidas`;
        return new Response(vlessLink, {
          headers: { 
            'content-type': 'text/plain; charset=utf-8',
            'subscription-userinfo': `upload=0; download=0; total=107374182400; expire=${expireTimestamp}`
          }
        });
      }
      return new Response('Not Found', { status: 404 });
    }

    const webSocketPair = new WebSocketPair();
    const [client, webSocket] = Object.values(webSocketPair);
    webSocket.accept();

    let remoteSocket = null;
    webSocket.addEventListener('message', async event => {
      if (remoteSocket) {
        const writer = remoteSocket.writable.getWriter();
        await writer.write(event.data);
        writer.releaseLock();
        return;
      }
      remoteSocket = connect({ hostname: 'cdn.cloudflare.net', port: 443 });
      const writer = remoteSocket.writable.getWriter();
      await writer.write(event.data);
      writer.releaseLock();
      remoteSocket.readable.pipeTo(new WritableStream({
        write(chunk) { webSocket.send(chunk); }
      }));
    });
    return new Response(null, { status: 101, webSocket: client });
  }
};
