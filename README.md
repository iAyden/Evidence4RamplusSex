# Study Session Planner

Build a schedule by choosing a start time, a focus duration, a break duration, and a number of sessions. The planner shows each block, the total duration, and the finish time. If a schedule crosses midnight, the timeline shows the day offset.

## Install and run

Install Git and Node.js 24, which includes npm. From the repository's GitHub page, copy the HTTPS clone URL under **Code**, then run the following commands with that URL.

```sh
git clone REPOSITORY_HTTPS_URL study-session-planner
cd study-session-planner
npm ci
npm start
```

Open [the local planner](http://127.0.0.1:4173/) and select **Build schedule** after changing the inputs. The inputs stay in the browser. The app has no backend, runtime dependencies, or configuration secrets.

For a quick check, start at 09:00 with three 25-minute focus blocks and five-minute breaks. The schedule should have five rows and finish at 10:25.

## Test and build

```sh
npm test
npm run build
```

The tests cover normal schedules, bounds, zero-minute breaks, midnight rollover, and invalid inputs. The [CI workflow](.github/workflows/ci.yml) runs the same tests and build on every pull request and on pushes to `main`. The static files are built into `dist/`.

## Deploy

Use the GitHub Actions publishing source for GitHub Pages. After CI passes on `main`, run **Deploy to GitHub Pages** with the full commit SHA for that CI run. Follow the [deployment runbook](docs/DEPLOYMENT.md) to set up the environment, check the public site, roll back, and record the release.

The [merge rules](docs/MERGE-RULES.md) describe the required review and status check. The [development log](docs/DEVELOPMENT-LOG.md) records the work and verification.
