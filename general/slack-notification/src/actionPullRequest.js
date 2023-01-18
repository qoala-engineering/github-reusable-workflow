const createSlackChat = require("./createSlackChat");
const getIssue = require("./getIssue");
const issueChecker = require("./issueChecker");

/**
 * Business Logic for executing the Pull Request actions.
 *
 * @param {*} {
 *   core,
 *   octokit,
 *   slack,
 *   inputs,
 *   owner,
 *   repo
 * }
 */
async function actionPullRequest({
  core,
  octokit,
  slack,
  inputs,
  owner,
  repo,
}) {
  const response = await getIssue({
    owner,
    repo,
    octokit,
    issueId: inputs.issueId,
  });

  const metadata = await issueChecker({
    core,
    octokit,
    inputs,
    owner,
    repo,
    issueDescription: response.body,
  });

  core.debug(`body: ${JSON.stringify(metadata)}`);

  if (metadata.includes("__blocks")) {
    core.info("Skip the Create Slack Chat because it already running.");
  } else {
    await createSlackChat({
      core,
      octokit,
      slack,
      inputs,
      owner,
      repo,
      metadata,
      issueDescription: response.body,
    });
  }
}

module.exports = actionPullRequest;
