# PulseGuard Edge Preview Check GitHub Action 🛡️

Automate zero-false-positive multi-region edge verification for PR preview deployments (Vercel, Cloudflare Pages, Netlify, Kubernetes staging).

## Usage

Add this step to your GitHub Actions CI workflow after deploying a preview branch:

```yaml
name: Preview Deployment & Verification

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy Preview
        id: deploy
        run: |
          # Your preview deployment step (e.g. Vercel / Cloudflare Pages)
          echo "preview_url=https://pr-142.preview.example.com" >> $GITHUB_OUTPUT

      - name: PulseGuard Edge Health Check
        uses: pulseguard/action@v1
        with:
          api_key: ${{ secrets.PULSEGUARD_API_KEY }}
          url: ${{ steps.deploy.outputs.preview_url }}
          regions: "wnam,weur,apac"
          fail_on_down: true
          comment_on_pr: true
```

## Inputs

| Input           | Required | Default               | Description                            |
| :-------------- | :------- | :-------------------- | :------------------------------------- |
| `api_key`       | **Yes**  | —                     | PulseGuard API key (`pg_live_...`)     |
| `url`           | **Yes**  | —                     | Target preview URL to test             |
| `regions`       | No       | `wnam,weur,apac`      | Comma-separated sovereign region codes |
| `fail_on_down`  | No       | `true`                | Fail CI step if quorum check fails     |
| `comment_on_pr` | No       | `true`                | Post sticky PR markdown summary table  |
| `github_token`  | No       | `${{ github.token }}` | GitHub token for posting comments      |

## Outputs

- `status`: Global quorum consensus status (`UP` or `DOWN`).
- `latency_ms`: Average latency in milliseconds across checked sovereign regions.
- `quorum_ratio`: Quorum consensus ratio (e.g. `3/3`).
