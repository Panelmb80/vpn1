import { connect } from 'cloudflare:sockets';

let userID = 'fb3b1c65-9c8f-4ef0-88bc-68cad2e927c2';
const proxyIP = 'cdn.cloudflare.net';

export default {
  async fetch(request, env, ctx) {
    try {
      const upgradeHeader = request.headers.get('Upgrade');
      if (!upgradeHeader || upgradeHeader !== 'websocket') {
        const url = new URL(request.url);
        if (url.pathname === "/VIPMidas") {
          const vlessLink = `vless://${userID}@vpn1.vpnkey.workers.dev:443?encryption=none&security=tls&type=ws&host=vpn1.vpnkey.workers.dev&path=/&sni=vpn1.vpnkey.workers.dev#VIPMidas`;
          return new Response(vlessLink, {
            headers: { 'content-type': 'text/plain; charset=utf-8' }
          });
        }
        return new Response('Not Found', { status: 404 });
      } else {
        return await vlessOverWS(request);
      }
    } catch (err) {
      return new Response(err.toString(), { status: 500 });
    }
  }
};

async function vlessOverWS(request) {
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
    remoteSocket = connect({ hostname: proxyIP, port: 443 });
    const writer = remoteSocket.writable.getWriter();
    await writer.write(event.data);
    writer.releaseLock();
    
    remoteSocket.readable.pipeTo(new WritableStream({
      write(chunk) { webSocket.send(chunk); }
    }));
  });
  return new Response(null, { status: 101, webSocket: client });
}
