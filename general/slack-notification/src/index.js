const core = require("@actions/core");
const github = require("@actions/github");
const { WebClient } = require("@slack/web-api");

const actionGetMetadata = require("./actionGetMetadata");
const actionPullRequest = require("./actionPullRequest");
const actionUpdateChat = require("./actionUpdateChat");
const constants = require("./constants");

/**
 * Application run function like IIFE.
 */
async function run() {
  try {
    const inputs = {
      token: core.getInput("token"),
      repository: core.getInput("repository"),
      issueId: core.getInput("issue_id"),
      slackChannelId: core.getInput("slack_channel_id"),
      actionType: core.getInput("action_type"),
      slackTs: core.getInput("slack_ts"),
      slackBlocks: core.getInput("slack_blocks"),
      slackStatusMessage: core.getInput("slack_status_message"),
      slackToken: core.getInput("slack_token"),
      jobActionId: core.getInput("job_action_id"),
      slackThread: core.getInput("slack_thread"),
    };

    const [owner, repo] = inputs.repository.split("/");

    core.debug(`Token: ${inputs.token}`);
    core.debug(`Repository: ${owner} ${repo}`);
    core.debug(`Issue: ${inputs.issueId}`);
    core.debug(`Slack Channel ID: ${inputs.slackChannelId}`);
    core.debug(`Action Type: ${inputs.actionType}`);
    core.debug(`Slack Timestamp: ${inputs.slackTs}`);
    core.debug(`Slack Blocks: ${inputs.slackBlocks}`);
    core.debug(`Slack Status Message: ${inputs.slackStatusMessage}`);
    core.debug(`Slack Token: ${inputs.slackToken}`);
    core.debug(`Job Action ID: ${inputs.jobActionId}`);
    core.debug(`Slack Thread: ${inputs.slackThread}`);

    const octokit = github.getOctokit(inputs.token);
    const slack = new WebClient(inputs.slackToken);

    core.debug("GitHub Context");
    core.debug(JSON.stringify(github.context, null, 2));

    switch (inputs.actionType) {
      case constants.ACTION_PULL_REQUEST:
        await actionPullRequest({ core, octokit, slack, inputs, owner, repo });
        break;
      case constants.ACTION_GET_METADATA:
        await actionGetMetadata({ core, octokit, inputs, owner, repo });
        break;
      case constants.ACTION_UPDATE_CHAT:
        await actionUpdateChat({ core, slack, inputs, owner, repo });
        break;
      default:
        throw Error(
          `Action type must be "${constants.ACTION_PULL_REQUEST}", "${constants.ACTION_GET_METADATA}, or "${constants.ACTION_UPDATE_CHAT}"`,
        );
    }

    core.info("Success to run the script.");
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
