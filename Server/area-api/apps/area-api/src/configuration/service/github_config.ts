import * as dotenv from 'dotenv';
dotenv.config()

const client_id = process.env.GITHUB_CLIENT_ID  
const client_secret = process.env.GITHUB_CLIENT_SECRET 
const client_id_auth = process.env.GITHUB_CLIENT_ID_AUTH  
const client_secret_auth = process.env.GITHUB_CLIENT_SECRET_AUTH  

export default () => ({
    github: {
      api_version: process.env.GITHUB_API_VERSION,
      client_id: client_id ,
      client_secret:client_secret ,
      client_id_auth: client_id_auth ,
      client_secret_auth: client_secret_auth ,
      loginScope: [
        'user',
      ].join(" "),
      authorizationScope: [
        "read",
        "user",
        "user:email",
        "user:follow",
        "repo",
        "repo_deployment",
        "repo:status",
        "delete_repo",
        "write:discussion",
        "admin:org",
        "admin:org_hook",
        "gist",
        "notifications",
        "admin:enterprise",
        "workflow",
    ].join(" "),
      oauth2: {
        token_url: process.env.GITHUB_TOKEN_URL,
        authorization_url: process.env.GITHUB_AUTH_URL,
      },
      // Github Service Action Reaction
      service: {
        name: 'github',
        actions: [
          { // createPrivateRepositoryTrigger 0
            name: 'new_private_github_repository_created',
            description: 'Trigger when a private github repository is created',
            data: {}
          },
          { // deletePrivateRepositoryTrigger 1
            name: 'new_private_github_repository_deleted',
            description: 'Trigger when a private github repository is deleted',
            data: {}
          },
          { // createPublicRepositoryTrigger 2
            name: 'new_public_github_repository_created',
            description: 'Trigger when a public github repository is created',
            data: {}
          },
          { // deletePublicRepositoryTrigger 3
            name: 'new_public_github_repository_deleted',
            description: 'Trigger when a public github repository is deleted',
            data: {}
          },
        ],
        reactions: [
          { // 0: this.createPublicRepository.bind(this), https://docs.github.com/en/free-pro-team@latest/rest/repos/repos?apiVersion=2022-11-28#create-a-repository-for-the-authenticated-user--parameters
            name: 'create_a_public_repository',
            description: 'The user create a public github repository',
            data: {
              name: "The name of the github repository",
              description: "The description the github repository *optional*",
              homepage: "A URL with more information about the repository. *optional*",
              gitignore_template: "The desired language or platform to apply to the .gitignore. *optional*",
              license_template: "The license keyword of the open source license for this repository. *optional*",
              auto_init: "Whether the repository is initialized with a minimal README. Default: false *optional**boolean*",
              allow_squash_merge: "Whether to allow squash merges for pull requests. Default: true *optional**boolean*",
              allow_merge_commit: "Whether to allow merge commits for pull requests. Default: true *optional**boolean*",
              allow_rebase_merge: "Whether to allow rebase merges for pull requests. Default: true *optional**boolean*",
              allow_auto_merge: "Whether to allow Auto-merge to be used on pull requests. Default: false *optional**boolean*",
              has_downloads: "Whether downloads are enabled. Default: true *optional**boolean*",
              is_template: "Whether this repository acts as a template that can be used to generate new repositories. Default: false *optional**boolean*",
            }
          },
          { // 1: this.createPrivateRepository.bind(this), https://docs.github.com/en/free-pro-team@latest/rest/repos/repos?apiVersion=2022-11-28#create-a-repository-for-the-authenticated-user--parameters
            name: 'create_a_private_repository',
            description: 'The user create a private github repository',
            data: {
              name: "The name of the github repository",
              description: "The description the github repository *optional*",
              homepage: "A URL with more information about the repository. *optional*",
              gitignore_template: "The desired language or platform to apply to the .gitignore. *optional*",
              license_template: "The license keyword of the open source license for this repository. *optional*",
              auto_init: "Whether the repository is initialized with a minimal README. Default: false *optional**boolean*",
              allow_squash_merge: "Whether to allow squash merges for pull requests. Default: true *optional**boolean*",
              allow_merge_commit: "Whether to allow merge commits for pull requests. Default: true *optional**boolean*",
              allow_rebase_merge: "Whether to allow rebase merges for pull requests. Default: true *optional**boolean*",
              allow_auto_merge: "Whether to allow Auto-merge to be used on pull requests. Default: false *optional**boolean*",
              has_downloads: "Whether downloads are enabled. Default: true *optional**boolean*",
              is_template: "Whether this repository acts as a template that can be used to generate new repositories. Default: false *optional**boolean*",
            }
          },
          { //       2: this.createPrivateRepositoryWithTemplate.bind(this),
            name:"create_private_repository_with_template",
            description: 'Create a private repository using a template.',
            data: {
              name: "The name of the new repository.",
              template_owner: "The account owner of the template repository. The name is not case sensitive.",
              template_repo: "The name of the template repository without the .git extension. The name is not case sensitive.",
              description: "A short description of the new repository. *optional*",
              include_all_branches: "Set to true to include the directory structure and files from all branches in the template repository, and not just the default branch. Default: false *optional**boolean*",
            }
          },
          { //       3: this.createPublicRepositoryWithTemplate.bind(this),
            name:"create_public_repository_with_template",
            description: 'Create a public repository using a template.',
            data: {
              name: "The name of the new repository.",
              template_owner: "The account owner of the template repository. The name is not case sensitive.",
              template_repo: "The name of the template repository without the .git extension. The name is not case sensitive.",
              description: "A short description of the new repository. *optional*",
              include_all_branches: "Set to true to include the directory structure and files from all branches in the template repository, and not just the default branch. Default: false *optional**boolean*",
            },
          },
          { //       4: this.createPrivateOrganisationRepository.bind(this),
            name:"create_private_organization_repository",
            description: 'Create a private repository within an organization.',
            data: {
              "org": "The organization name. The name is not case sensitive.",
              "name": "The name of the repository.",
              "description": "A short description of the repository. *optional*",
              "homepage": "A URL with more information about the repository. *optional*",
              "visibility": "public or private, The visibility of the repository *optional*",
              "gitignore_template": "Desired language or platform .gitignore template to apply. Use the name of the template without the extension. For example, 'Haskell'. *optional*",
              "license_template": "Choose an open source license template that best suits your needs, and then use the license keyword as the license_template string. For example, 'mit' or 'mpl-2.0'. *optional*",
              "is_template": "Either true to make this repo available as a template repository or false to prevent it. Default: false *optional**boolean*"
            }
          },
          { //       5: this.createPublicOrganisationRepository.bind(this),
            name:"create_public_organization_repository",
            description: 'Create a public repository within an organization.',
            data: {
              "org": "The organization name. The name is not case sensitive.",
              "name": "The name of the repository.",
              "description": "A short description of the repository. *optional*",
              "homepage": "A URL with more information about the repository. *optional*",
              "visibility": "public or private, The visibility of the repository *optional*",
              "gitignore_template": "Desired language or platform .gitignore template to apply. Use the name of the template without the extension. For example, 'Haskell'. *optional*",
              "license_template": "Choose an open source license template that best suits your needs, and then use the license keyword as the license_template string. For example, 'mit' or 'mpl-2.0'. *optional*",
              "is_template": "Either true to make this repo available as a template repository or false to prevent it. Default: false *optional**boolean*"
            }
          },
          { //       6: this.updateGithubRepository.bind(this),
            name:"update_github_repository",
            description: 'Update an existing GitHub repository.',
            data: {
              "owner": "The account owner of the repository. The name is not case sensitive.",
              "repo": "The name of the repository without the .git extension. The name is not case sensitive.",
              "name": "The name of the repository. *optional*",
              "description": "A short description of the repository. *optional*",
              "default_branch": "Updates the default branch for this repository. *optional*",
              "homepage": "A URL with more information about the repository. *optional*",
              "visibility": "The visibility of the repository. Can be one of: public, private. *optional*",
              "private": "Either true to make the repository private or false to make it public. Default: false *optional**boolean*",
              "has_issues": "Either true to enable issues for this repository or false to disable them. Default: true. *optional**boolean*",
              "has_projects": "Either true to enable projects for this repository or false to disable them. Note: If you're creating a repository in an organization that has disabled repository projects, the default is false, and if you pass true, the API returns an error. Default: true. *optional**boolean*",
              "has_wiki": "Either true to enable the wiki for this repository or false to disable it. Default: true. *optional**boolean*",
              "is_template": "Either true to make this repo available as a template repository or false to prevent it. Default: false *optional**boolean*"
            }
          },
          { //       7: this.deleteGithubRepository.bind(this),
            name:"delete_github_repository",
            description: 'Delete a GitHub repository.',
            data: {
              "owner": "The account owner of the repository. The name is not case sensitive.",
              "repo": "The name of the repository without the .git extension. The name is not case sensitive."
            }
          },
          { //       8: this.enableAutomatedSecurityFixes.bind(this),
            name:"enable_automated_security_fixes",
            description: 'Enable automated security fixes for a repository.',
            data: {
              "owner": "The account owner of the repository. The name is not case sensitive.",
              "repo": "The name of the repository without the .git extension. The name is not case sensitive."
            }
          },
          { //       9: this.disableAutomatedSecurityFixes.bind(this),
            name:"disable_automated_security_fixes",
            description: 'Disable automated security fixes for a repository.',
            data: {
              "owner": "The account owner of the repository. The name is not case sensitive.",
              "repo": "The name of the repository without the .git extension. The name is not case sensitive."
            }
          },
          { //       10: this.enableVulnerabilityAlerts.bind(this),
            name:"enable_vulnerability_alerts",
            description: 'Enable vulnerability alerts for a repository.',
            data: {
              "owner": "The account owner of the repository. The name is not case sensitive.",
              "repo": "The name of the repository without the .git extension. The name is not case sensitive."
            }
          },
          { //       11: this.disableVulnerabilityAlerts.bind(this),
            name:"disable_vulnerability_alerts",
            description: 'Disable vulnerability alerts for a repository.',
            data: {
              "owner": "The account owner of the repository. The name is not case sensitive.",
              "repo": "The name of the repository without the .git extension. The name is not case sensitive."
            }
          },
          { //       12: this.disablePrivateVulnerabilityReportingForRepository.bind(this),
            name:"disable_private_vulnerability_reporting",
            description: 'Disable private vulnerability reporting for a repository.',
            data: {
              "owner": "The account owner of the repository. The name is not case sensitive.",
              "repo": "The name of the repository without the .git extension. The name is not case sensitive."
            }
          },
          { //       13: this.enablePrivateVulnerabilityReportingForRepository.bind(this),
            name:"enable_private_vulnerability_reporting",
            description: 'Enable private vulnerability reporting for a repository.',
            data: {
              "owner": "The account owner of the repository. The name is not case sensitive.",
              "repo": "The name of the repository without the .git extension. The name is not case sensitive."
            }
          },
          { //       14: this.createAForkRepository.bind(this),
            name:"create_fork_repository",
            description: 'Create a fork of an existing repository.',
            data: {
              "owner": "The account owner of the repository. The name is not case sensitive.",
              "repo": "The name of the repository without the .git extension. The name is not case sensitive.",
              "organization": "Parameter to specify the organization name if forking into an organization. *optional*",
              "name": "When forking from an existing repository, a new name for the fork. *optional*",
              "default_branch_only": "When forking from an existing repository, fork with only the default branch. *optional**boolean*"
            }
          },
          { //       15: this.renameARepositoryBranch.bind(this),
            name:"rename_repository_branch",
            description: 'Rename a branch within a repository.',
            data: {
              "owner": "The account owner of the repository. The name is not case sensitive.",
              "repo": "The name of the repository without the .git extension. The name is not case sensitive.",
              "branch": "The name of the branch. Cannot contain wildcard characters. To use wildcard characters in branch names, use the GraphQL API.",
              "new_name": "The new name of the branch."
            }
          },
          { //       16: this.createRepositoryBranch.bind(this),
            name:"create_repository_branch",
            description: 'Create a new branch within a repository.',
            data: {
              "owner": "The account owner of the repository. The name is not case sensitive.",
              "repo": "The name of the repository without the .git extension. The name is not case sensitive.",
              "ref": "The name of the fully qualified reference (i.e., refs/heads/master). If it doesn't start with 'refs' and have at least two slashes, it will be rejected.",
              "sha": "The SHA1 value for this reference."
            }
          },
          { //       17: this.updateRepositoryBranch.bind(this),
            name:"update_repository_branch",
            description: 'Update an existing branch within a repository.',
            data: {
              "owner": "The account owner of the repository. The name is not case sensitive.",
              "repo": "The name of the repository without the .git extension. The name is not case sensitive.",
              "ref": "The name of the reference to update (for example, heads/featureA). Can be a branch name (heads/BRANCH_NAME) or tag name (tags/TAG_NAME). For more information, see 'Git References' in the Git documentation.",
              "sha": "The SHA1 value to set this reference to",
              "force": "Indicates whether to force the update or to make sure the update is a fast-forward update. Leaving this out or setting it to false will make sure you're not overwriting work. Default: false *optional**boolean*"
            }
          },
          { //       18: this.deleteRepositoryBranch.bind(this),
            name:"delete_repository_branch",
            description: 'Delete a branch within a repository',
            data: {
              "owner": "The account owner of the repository. The name is not case sensitive.",
              "repo": "The name of the repository without the .git extension. The name is not case sensitive.",
              "ref": "The commit reference. Can be a commit SHA, branch name (heads/BRANCH_NAME), or tag name (tags/TAG_NAME). For more information, see 'Git References' in the Git documentation."
            }
          },
        ],
      }
    },
  });

