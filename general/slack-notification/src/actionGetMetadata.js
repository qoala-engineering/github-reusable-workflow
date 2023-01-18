const getIssue = require("./getIssue");
const issueChecker = require("./issueChecker");

/**
 * Business Logic for executing the Get Metadata actions.
 *
 * @param {*} { core, octokit, inputs, owner, repo }
 */
async function actionGetMetadata({ core, octokit, inputs, owner, repo }) {
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

  if (!metadata.includes("__blocks")) {
    throw Error("The '__blocks' metadata is missing.");
  }

  const [, slackTs] = /__slackTs:(.+)/.exec(metadata);
  const [, blocks] = /__blocks:(.+)/.exec(metadata);

  core.debug(`Slack Timestamp: ${slackTs}`);
  core.debug(`Slack Blocks: ${JSON.stringify(blocks)}`);

  core.setOutput("slack_ts", slackTs);
  core.setOutput("slack_blocks", blocks);
}

module.exports = actionGetMetadata;
