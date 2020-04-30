# Single Package

This is a minimal config for a (React +) TypeScript package to publish to NPM.

If you like this template, leave a [reference to it](https://github.com/danielkov/single-package) somewhere in your project.

## Get started

If you're visiting the [GitHub Repository](https://github.com/danielkov/single-package) and are logged in with your account, you can press **[Use this template](https://github.com/danielkov/single-package/generate)** to grab this repository for your own project. Alternatively you can fork this package and get started that way. After forking, you can periodically check the diff of this package with your own to see if anything changed and decide if you want to apply those changes to your repository too.

Next thing you should do is to replace all references to this repository with your own, e.g.: the name property in [`package.json`](package.json#L2), as well as `"repository"` and `"author"` fields. Next, you should open the [`LICENSE`](LICENSE) file and modify the name and year in the header to match your preferences.

Install dependencies with `npm install`.

If your IDE is not running the linter by default as a service, you can lint files manually with

```sh
npm run lint
```

Run tests in watch mode:

```sh
npm test -w
```

Once you're happy with your changes, use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) standard to create your commit messages.

To build your package, use the command:

```sh
npm build
```

To create a new version of this package to deploy to NPM or the package repository of your choice, use:

```sh
npm run sv
```

Finally, make sure everything is up to date with your version control with `git push --follow-tags` and then to publish your package, use:

```sh
npm publish
```

Alternatively you can use the GitHub Worflow, by triggering a release - going to Releases -> Draft a new release. This will do the above for you, as well as publish it to GitHub's NPM Mirror. If you want to use this method, you need to edit [Publish Workflow file](.github/workflows/publish.yml) by replacing `your-github-username` with your GitHub username and adding the `npm_token` secret in settings.
