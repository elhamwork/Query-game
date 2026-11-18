// Quarry Duel relay server. One Durable Object per room code fans messages out to everyone in that room.
// Clients send {t: topic, m: message}. The server never reads the game data.
export class Room {
  constructor(state) { this.state = state; }
  async fetch(request) {
    if (request.headers.get('Upgrade') !== 'websocket') return new Response('Expected websocket', { status: 426 });
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    this.state.acceptWebSocket(server);
    return new Response(null, { status: 101, webSocket: client });
  }
  webSocketMessage(ws, msg) {
    if (typeof msg !== 'string' || msg.length > 8192) return;
    for (const s of this.state.getWebSockets()) {
      if (s !== ws) { try { s.send(msg); } catch (e) {} }
    }
  }
  webSocketClose(ws) { try { ws.close(); } catch (e) {} }
  webSocketError(ws) { try { ws.close(); } catch (e) {} }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/' || url.pathname === '/health') return new Response('Quarry Duel relay is up', { headers: { 'content-type': 'text/plain' } });
    if (url.pathname !== '/ws') return new Response('Not found', { status: 404 });
    const room = (url.searchParams.get('r') || 'lobby').slice(0, 96);
    const id = env.ROOM.idFromName(room);
    return env.ROOM.get(id).fetch(request);
  },
};
