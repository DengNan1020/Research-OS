# Research OS

Research OS is a lightweight desktop app for managing research progress, workflow checklists, and dated tasks in one place.

## What it does

- Research pipeline tracking with fixed stages
- Workflow-style misc tasks with checklist items
- Calendar view with date-linked tasks
- Local persistence in the browser or desktop app

## Download

Releases are published on GitHub.

- macOS: `.dmg`
- Windows: `.zip` portable package, extract and run

## Development

```bash
npm install
npm run dev
```

To run the desktop shell locally:

```bash
npm run tauri:dev
```

## Release

Create a tag that starts with `v`, then push it to GitHub.

```bash
git tag v0.0.1
git push origin v0.0.1
```

The GitHub Actions workflow will build and upload:

- macOS `.dmg`
- Windows `.zip`

## Project Layout

- `src/` frontend code
- `src-tauri/` Tauri desktop shell
- `.github/workflows/` release automation

