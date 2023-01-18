/**
 * Utility function to get the metadata of the PR or Issue.
 *
 * @param {*} { owner, repo, octokit, issueId }
 * @return {*} Response of the Issue
 */
async function getIssue({ owner, repo, octokit, issueId }) {
  const { data: response } = await octokit.rest.issues.get({
    owner,
    repo,
    issue_number: issueId,
  });

  return response;
}

module.exports = getIssue;
