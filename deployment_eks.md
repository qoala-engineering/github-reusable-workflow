# GitHub Action: EKS Deployment Pipeline

## Overview

The **Deployment Pipeline** GitHub Action automates the deployment process for services and applications. It utilizes a series of steps to generate configuration settings, perform database migration, build and push Docker images, and deploy the service to an Amazon Elastic Kubernetes Service (EKS) cluster. Additionally, it can include optional regression testing.

## Inputs

The action accepts the following inputs:

- **bu (required):** The business unit name.
- **environment (required):** The target environment (e.g., dev, uat, prod).
- **service_name (required):** The name of the service or application, also used as the ECR (Amazon Elastic Container Registry) repo name.
- **config_path (optional):** The path to the service configuration file. Default value: `iac/service.config.yml`.
- **with_db_migration (optional):** Whether to perform database migration. Default value: `false`.
- **with_seeder (optional):** Whether to include database seeding. Default value: `false`.
- **lang (optional):** The programming language used by the service.
- **db_migration_path (optional):** The path to the database migration folder. Default value: `database/migrations`.
- **db_seeder_path (optional):** The path to the database seeder folder. Default value: `database/seeder`.
- **node_version (optional):** The version of Node.js. Default value: `12`.
- **go_version (optional):** The version of Golang. Default value: `^1.17.5`.
- **db_name_key (optional):** The key for the database name in SSM (Systems Manager Parameter Store).
- **db_host_key (optional):** The key for the database host in SSM.
- **db_user_key (optional):** The key for the database user in SSM.
- **db_password_key (optional):** The key for the database password in SSM.
- **consumer (optional):** Set to `true` if you need to deploy a consumer service. Default value: `false`.
- **ecr_name (optional):** Override the service_name as the ECR name.
- **with_ca_crt (optional):** Provide an option to insert the ca.crt file from GitHub secrets. Default value: `false`.
- **dockerfile (optional):** The Dockerfile to use for building the image. Default value: `Dockerfile`.
- **ssm_folder (optional):** The SSM folder for storing configuration values.
- **katalon_api_key (optional):** The Katalon API key.
- **test_suite_collection_path (optional):** The path to the test suite collection for regression testing. Default value: `Test Suites/QoalaPlus_RegressionTest`.
- **execution_profile (optional):** The execution profile for regression testing. Default value: `DEV_ACTION`.
- **browser_type (optional):** The browser type for regression testing. Default value: `Chrome (headless)`.
- **java_distribution (optional):** Java distribution to run Katalon for regression testing. Default value: `zulu`.
- **java_version (optional):** Java version to run Katalon for regression testing. Default value: `8`.
- **katalon_secret_ssm_key (optional):** The SSM key for the Katalon JSON secret. Default value: `JSON_SECRET`.
- **katalon_version (optional):** The Katalon version for regression testing. Default value: `8.3.0`.
- **with_regression_test (optional):** Set to `true` to include regression testing. Default value: `false`.
- **allowed_branches (optional):** Allowed branches for auto-deployment. Default value: `''`.

## Outputs

The action provides the following outputs:

- **environment:** The resolved environment prefix (e.g., dev, uat, or prod).
- **eks_cluster:** The name of the AWS Elastic Kubernetes Service (EKS) cluster associated with the target environment.
- **namespace:** The Kubernetes namespace based on the environment prefix and business unit.
- **build_role_arn:** The IAM role ARN used for pushing images to the Amazon Elastic Container Registry (ECR).
- **deploy_role_arn:** The IAM role ARN used for deploying services to the EKS cluster.
- **aws_region:** The AWS region associated with the target environment.
- **ssm_role_arn:** The IAM role ARN used for accessing SSM parameters.
- **ssm_path:** The SSM path where configuration values will be stored for the service.
- **node_env:** The abbreviated name of the environment (e.g., `dev`, `uat`, or `prod`).
- **image_registry:** The registry URL for the Docker image.
- **image_tag:** The tag for the Docker image.

## Usage

To use the **Deployment Pipeline** GitHub Action in your workflow, you can follow these steps:

1. In your GitHub repository, create a new workflow file (e.g., `.github/workflows/deployment-pipeline.yml`).

2. Define the workflow to trigger on specific events, such as push to the main branch.

3. Configure the workflow steps by specifying inputs and outputs based on your service/application requirements.

4. Customize the workflow as needed, including optional database migration and regression testing steps.

5. After running the workflow, you can access the output values in the subsequent steps of the same job or in other jobs.

## Here's an explanation for each step in the provided GitHub Action:

1. **Step: Checkout Generate Config Action Repo**
   - This step checks out the repository that contains the custom action for generating configuration settings. The repository is `qoala-engineering/generate-config-action`.
   - The token used to access the repository is provided using the `token` parameter, which comes from the GitHub Secrets.

2. **Step: Generate Config**
   - This step uses the custom action `qoala-engineering/generate-config-action` to generate configuration settings based on the provided inputs.
   - The outputs from this step include environment-related information like `environment`, `eks_cluster`, `namespace`, `build_role_arn`, `deploy_role_arn`, `aws_region`, `ssm_role_arn`, `ssm_path`, and `node_env`.
   - The inputs for this step include `bu`, `environment`, `service_name`, `ssm_folder`, and `allowed_branches`.

3. **Step: Checkout Goose Migration Action Repo**
   - This step checks out the repository that contains the custom action for performing database migration using Golang and Goose. The repository is `qoala-engineering/goose-migration-action`.
   - This step will be executed if `with_db_migration` is set to `true` and `lang` is set to `'golang'`.

4. **Step: Goose Migration**
   - This step uses the custom action `qoala-engineering/goose-migration-action` to perform database migration using Golang and Goose.
   - The inputs for this step include database-related parameters like `db_name_key`, `db_host_key`, `db_user_key`, `db_password_key`, `db_migration_path`, `with_seeder`, and `db_seeder_path`.
   - The role for assuming permissions to access AWS resources is specified using the `role_to_assume` parameter, which comes from the output of the `Generate Config` step.

5. **Step: Checkout Knex Migration Action Repo**
   - This step checks out the repository that contains the custom action for performing database migration using Node.js and Knex. The repository is `qoala-engineering/knex-migration-action`.
   - This step will be executed if `with_db_migration` is set to `true` and `lang` is set to `'nodejs'`.

6. **Step: Knex Migration**
   - This step uses the custom action `qoala-engineering/knex-migration-action` to perform database migration using Node.js and Knex.
   - The inputs for this step include database-related parameters like `db_name_key`, `db_host_key`, `db_user_key`, `db_password_key`, `with_seeder`, and `node_version`.
   - The role for assuming permissions to access AWS resources is specified using the `role_to_assume` parameter, which comes from the output of the `Generate Config` step.

7. **Step: Checkout ECR Publish GitHub Action Repo**
   - This step checks out the repository that contains the custom action for building and pushing Docker images to the Amazon Elastic Container Registry (ECR). The repository is `qoala-engineering/ecr-publish-action`.

8. **Step: Inject CA CERT File**
   - This step is used to inject the CA (Certificate Authority) certificate file into the workflow context. It will be executed if `with_ca_crt` is set to `true`.
   - The CA certificate file is stored as a GitHub secret and is used for secure communication with the ECR.

9. **Step: Build and Push Image**
   - This step uses the custom action `qoala-engineering/ecr-publish-action` to build the Docker image and push it to the ECR.
   - The inputs for this step include parameters like `aws-region`, `ecr_name`, `role-to-assume`, `dockerfile`, `ecr_cache_tag`, `build_args`, and `custom_tags`.
   - The `build_args` parameter includes a list of build arguments that are used when building the Docker image.

10. **Step: Checkout GitHub Action Repo**
    - This step checks out the repository that contains the custom action for setting up Helm and deploying the service to the EKS cluster. The repository is `qoala-engineering/setup-eks-helm-action`.

11. **Step: Setup EKS Helm**
    - This step uses the custom action `qoala-engineering/setup-eks-helm-action` to set up Helm for the EKS cluster.
    - The inputs for this step include parameters like `aws-region`, `role-to-assume`, `github-token`, and `cluster-name`.

12. **Step: Checkout SSM Injection**
    - This step checks out the repository that contains the custom action for injecting SSM values into Helm charts. The repository is `qoala-engineering/helm-values-ssm-injection`.

13. **Step: SSM Injection**
    - This step uses the custom action `qoala-engineering/helm-values-ssm-injection` to inject SSM parameter values into the Helm chart.
    - The inputs for this step include parameters like `image`, `environment`, `configPath`, and `serviceName`.
    - The output of this step provides the Helm chart values with the SSM parameter values injected.

14. **Step: Deploy service**
    - This step uses Helm to deploy the service to the EKS cluster.
    - The `helm upgrade` command installs or upgrades the Helm chart with the provided configuration values.

15. **Step: Checkout GitHub Action Repo**
    - This step checks out the repository that contains the custom action for running regression tests using Katalon. The repository is `qoala-engineering/automation-test-action`.

16. **Step: QA Automation Test**
    - This step uses the custom action `qoala-engineering/automation-test-action` to run regression tests using Katalon.
    - The inputs for this step include parameters like `role-to-assume`, `aws-region`, `java-distribution`, `java-version`, `ssm-key`, `env`, `bu`, `katalon-version`, `test-suite-collection-path`, `browser-type`, `api-key`, and `execution-profile`.
    - This step will be executed if `with_regression_test` is set to `true`.

Please note that this explanation provides an overview of each step's purpose and the parameters used for customization. Make sure to adapt the workflow to your specific use case, including the custom actions used in each step and the required GitHub Secrets.