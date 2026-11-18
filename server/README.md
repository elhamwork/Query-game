# Quarry Duel relay server

Tiny Cloudflare Worker that relays game messages between friends. Free plan works.

Deploy from the Cloudflare dashboard:
1. Workers & Pages > Create > Import a repository > pick this repo.
2. Set Root directory to `server`. Leave the deploy command as `npx wrangler deploy`.
3. Deploy. You get `https://qd-relay.YOURNAME.workers.dev`.
4. In the game set `QD_SERVER` to `wss://qd-relay.YOURNAME.workers.dev/ws` or open the game with `?server=wss://qd-relay.YOURNAME.workers.dev/ws`.
