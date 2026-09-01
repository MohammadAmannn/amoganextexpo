# Developer workflow

1. `git checkout -b feature/<name>`.
2. Decide scope: shared logic package, web-only, mobile-only, or cross-platform contract.
3. Add/update schemas and types before UI for new domains.
4. Add data access in `packages/api` or server-only routes/functions for privileged actions.
5. Build web UI with Amoga shadcn components; build mobile UI with RNR/NativeWind.
6. Run `pnpm check`, `pnpm build:web`, `pnpm mobile:doctor`.
7. Add tests for business logic and critical flows.
8. Open PR; all CI checks must pass.
9. Reusable package changes get a Changeset.

Never import files from `apps/web` into `apps/mobile` or vice versa. Promote reusable code into `packages/*`.
