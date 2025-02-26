# https://hub.docker.com/_/node/tags?name=alpine
FROM node:22.14.0-alpine3.21 AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --chown=nextjs:nodejs ./.next/standalone ./
COPY --chown=nextjs:nodejs ./.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT 3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]