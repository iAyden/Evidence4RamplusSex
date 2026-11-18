# Deploy Study Session Planner

The [deployment workflow](../.github/workflows/deploy.yml) builds the selected `main` commit and publishes the `dist/` folder to GitHub Pages. The hosting service and workflow use GitHub's built-in credentials.

## 1. Before

1. On the first release, a repository maintainer opens **Settings → Pages** and selects **GitHub Actions** under **Build and deployment → Source**. In **Settings → Environments**, open `github-pages` or create it if it is missing. Under **Deployment branches and tags**, allow only the `main` branch. [GitHub Pages publishing setup](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#publishing-with-a-custom-github-actions-workflow)
2. Review and merge the intended changes through pull requests. In **Actions → CI**, verify that **Unit tests** passed for the `main` commit. Record the commit SHA and the CI run URL.
3. If the site is already live, open `release.txt` relative to the site URL and record the SHA, previous successful deployment link, and site URL. If this is the first release, record that there is no previous deployment.

## 2. Deploy

1. Open **Actions → Deploy to GitHub Pages → Run workflow**. Select `main`, paste the full SHA from the successful CI run into the expected SHA field, and click **Run workflow**. Dispatching requires write access. [Running a workflow manually](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow)
2. Confirm **Test and package site** and **Publish site** both succeed. If the selected commit differs from the expected SHA, check CI for the current tip of `main` before dispatching again. A test or build failure prevents publication. For a configuration failure, verify the Pages source and environment settings, then dispatch again after resolving the cause. [GitHub Pages workflow requirements](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

## 3. Verify

1. Open the deployment URL from **Publish site** in a private browser window. Open `release.txt` under that same URL and confirm it contains the full SHA from the successful Actions run. Allow a few minutes for GitHub Pages to serve the new release, then recheck if necessary.
2. Enter `09:00` start, `25` minutes of focus, `5` minutes of break, and `3` sessions. Click **Build schedule**. Confirm the schedule has three focus blocks and two break blocks, ends at `10:25`, and finishes with a focus block.
3. Enter `23:50`, `25` minutes of focus, `0` minutes of break, and `2` sessions. Confirm the schedule has two focus blocks and finishes at `00:40 (+1 day)`.
4. Set focus to `0` and submit. Confirm the form rejects the invalid value and supplies validation feedback.

## 4. Roll back

1. If the new site is live and verification fails, identify the merged pull request that introduced the problem and the previous known-good release recorded before deployment.
2. On the merged pull request, choose **Revert** to open a new pull request against `main`. If GitHub cannot create it, make the revert on a branch, resolve conflicts there, and open a pull request. Revert multiple changes in reverse merge order if needed to restore the known-good behavior. [Reverting a pull request](https://docs.github.com/en/pull-requests/how-tos/merge-and-close/reverting-a-pull-request)
3. Wait for **Unit tests** and one independent approval. Merge the revert, verify CI on the new `main` SHA, and repeat **Deploy** and **Verify**. The deployed SHA is the revert commit. Use the previous release to confirm the expected restored behavior.
4. If a failed first release leaves a broken public site and there is no earlier version, a maintainer can unpublish the site from **Settings → Pages** while the team prepares and reviews a fix. [Unpublishing a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/unpublishing-a-github-pages-site)

## 5. Record

Add an entry to the development log with the date and time zone, who deployed, the motivation for the release, the commit link, CI and deployment run links, and the public site URL. Include the smoke test results and any problems and fixes. For a rollback, include the failing deployment, revert pull request, restored run, and verification outcome.
