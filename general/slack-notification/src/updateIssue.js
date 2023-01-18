/**
 * Utility function to update the description of the PR or Issue.
 *
 * @param {*} {
 *   owner,
 *   repo,
 *   issueId,
 *   octokit,
 *   issueDescription
 * }
 */
async function updateIssue({
  owner,
  repo,
  issueId,
  octokit,
  issueDescription,
}) {
  await octokit.rest.issues.update({
    owner,
    repo,
    issue_number: issueId,
    body: issueDescription,
  });
}

module.exports = updateIssue;
