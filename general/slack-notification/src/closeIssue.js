/**
 * Utility function to closing the PR or Issue.
 *
 * @param {*} { owner, repo, issueId, message, octokit, core }
 */
async function closeIssue({ owner, repo, issueId, message, octokit, core }) {
  await octokit.rest.issues.createComment({
    owner: owner,
    repo: repo,
    issue_number: issueId,
    body: message,
  });

  core.info("Closing the pull requests.");
  await octokit.rest.pulls.update({
    owner,
    repo,
    pull_number: issueId,
    state: "closed",
  });
}

module.exports = closeIssue;
