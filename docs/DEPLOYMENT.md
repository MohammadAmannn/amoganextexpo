# Deployment

## Vercel
Connect GitHub repository and configure root directory `apps/web`. Add environment variables for Preview and Production. Keep server secrets unprefixed.

## EAS
All EAS commands run from `apps/mobile`, and `eas.json` lives there. Configure EAS once with `eas init`. Use `preview` for internal APK builds and `production` for store Android/iOS builds.

## GitHub
Add repository secret `EXPO_TOKEN`. Optional release workflows can be protected by a GitHub Environment named `production` requiring approval.

Recommended release policy: PR = tests/build validation; main = web production; version tag `v*` = EAS production Android+iOS.
