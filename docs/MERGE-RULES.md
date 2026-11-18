# Main branch protection

## Configure on GitHub

1. Confirm `main` is the default branch and that the **CI** workflow completed successfully on `main`. GitHub offers checks that have passed in this repository in the last seven days. [Required status check troubleshooting](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks)
2. In **Settings → Branches**, select **Add classic branch protection rule** and enter `main` as the pattern.
3. Select **Require a pull request before merging** and **Require approvals**. Set the number of approvals to **1**. Select **Dismiss stale pull request approvals when new commits are pushed**.
4. Select **Require status checks to pass before merging**, then add the **Unit tests** check from GitHub Actions. Enable **Do not allow bypassing the above settings** and leave force pushes and deletions disabled. Save the rule. [GitHub branch protection settings](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule#creating-a-branch-protection-rule)

## Demonstrate and record a blocked pull request

The prepared change gives callers a specific error if they pass a non-object value as the planner settings. The red commit adds a test for that error. The green commit implements it. The two commits are available under `demo/validation-fail` and `demo/validation-fix` in the local Git history.

1. Push only the red commit to a feature branch and open a pull request into protected `main` titled **Reject non-object planner settings**.
2. Wait for **Unit tests** to fail. Save the failing run URL and capture the pull request merge box showing the required failing check.
3. Push the green commit to the same feature branch. Wait for **Unit tests** to pass. A teammate with write access who did not author the pull request reviews and approves the change.
4. Merge the pull request through GitHub. Verify a green **CI** run on the new `main` commit. Record the pull request link, red run, green run, reviewer, and merge SHA in the development log.
