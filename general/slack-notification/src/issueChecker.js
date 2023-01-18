const os = require("os");

const closeIssue = require("./closeIssue");
const constants = require("./constants");
const updateIssue = require("./updateIssue");

async function issueChecker({
  core,
  octokit,
  inputs,
  owner,
  repo,
  issueDescription,
}) {
  core.debug(`Issue body: ${JSON.stringify(issueDescription)}`);

  const parsedBody = constants.REGEX_METADATA.exec(issueDescription);

  if (parsedBody === null) {
    core.info("Update issue with the metadata");

    await updateIssue({
      owner,
      repo,
      octokit,
      issueId: inputs.issueId,
      issueDescription:
        issueDescription +
        os.EOL +
        os.EOL +
        "<!--" +
        os.EOL +
        "Please edit the metadata. Open 'https://qoala-insurtech.atlassian.net/wiki/spaces/ENG/pages/2473197845/Pull+Request+Slack+Metadata+PRS' for reference." +
        os.EOL +
        "___BEGIN_SLACK_METADATA___" +
        os.EOL +
        "__publisherTeam:<Slack User will you mentioned in Release Checklist>" +
        os.EOL +
        "__deployedAt:<Date and Time for Deploy>" +
        os.EOL +
        "__releaseDocs:<Release Document Link>" +
        os.EOL +
        "__releaseNotes:<List of your release>" +
        os.EOL +
        "__audiences:<List user to CC>" +
        os.EOL +
        "___END_SLACK_METADATA___" +
        os.EOL +
        "-->" +
        os.EOL,
    });

    core.info("Add comment to update the metadata");
    await closeIssue({
      owner,
      repo,
      octokit,
      core,
      issueId: inputs.issueId,
      message:
        "Please update the **Slack Metadata** inside the **Issue Description**" +
        os.EOL +
        "After update the description, please **reopen** the Issue.",
    });

    throw Error("Need update the metadata");
  }

  const [, body] = parsedBody;

  return body;
}

module.exports = issueChecker;
