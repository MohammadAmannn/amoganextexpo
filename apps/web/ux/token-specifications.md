# AmogaDS — Token Specifications

## Semantic Tokens (`src/design-system/tokens/theme.css`)

| Token | Light Mode Value | Dark Mode Value | Usage |
|---|---|---|---|
| `--background` | `oklch(1 0 0)` | `oklch(0.129 0.042 264.695)` | Default application background |
| `--foreground` | `oklch(0.129 0.042 264.695)` | `oklch(0.984 0.003 247.858)` | Default body text color |
| `--card` | `oklch(1 0 0)` | `oklch(0.14 0.04 259.21)` | Card container surface |
| `--card-foreground` | `oklch(0.129 ...)` | `oklch(0.984 ...)` | Card container text color |
| `--popover` | `oklch(1 0 0)` | `oklch(0.208 ...)` | Popover / Dropdown menu surface |
| `--primary` | `oklch(0.208 ...)` | `oklch(0.929 ...)` | Primary action buttons & active states |
| `--secondary` | `oklch(0.968 ...)` | `oklch(0.279 ...)` | Secondary action buttons |
| `--muted` | `oklch(0.968 ...)` | `oklch(0.279 ...)` | Muted background surfaces |
| `--muted-foreground` | `oklch(0.554 ...)` | `oklch(0.704 ...)` | Subtitle & secondary text |
| `--destructive` | `oklch(0.577 ...)` | `oklch(0.704 ...)` | Danger & destructive actions |
| `--success` | `oklch(0.627 ...)` | `oklch(0.627 ...)` | Positive states, approvals |
| `--warning` | `oklch(0.769 ...)` | `oklch(0.769 ...)` | Non-blocking alerts, cautions |
| `--info` | `oklch(0.58 ...)` | `oklch(0.58 ...)` | Information callouts |
| `--border` | `oklch(0.929 ...)` | `oklch(1 0 0 / 10%)` | Component borders |
| `--input` | `oklch(0.929 ...)` | `oklch(1 0 0 / 15%)` | Form input borders |
| `--ring` | `oklch(0.704 ...)` | `oklch(0.551 ...)` | Focus ring outline |

## Radius Token Scale

- `--radius`: `0.625rem` (10px base)
- `rounded-sm`: `calc(var(--radius) - 4px)` (6px)
- `rounded-md`: `calc(var(--radius) - 2px)` (8px)
- `rounded-lg`: `var(--radius)` (10px)
- `rounded-xl`: `calc(var(--radius) + 4px)` (14px)
