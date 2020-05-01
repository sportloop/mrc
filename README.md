# MRC

Workout file parser library, suitable for `.mrc` and `.erg` files, with first-class TypeScript support.

## Get started

Install the package:

```sh
npm install @sportloop/mrc
```

Usage:

```ts
import * as MRC from "@sportloop/mrc";

const { courseHeader, courseData } = MRC.parse(`[COURSE HEADER]
VERSION = 2
UNITS = ENGLISH
DESCRIPTION = Spin at 30% FTP for a few minutes, then two back to back sprints and easy spin again.
FILE NAME = Two Towers
MINUTES PERCENT
[END COURSE HEADER]
[COURSE DATA]
0.00\t30
10.00\t30
10.00\t150
10.25\t150
10.25\t30
10.75\t30
10.75\t150
11.00\t150
11.00\t30
60.00\t30
[END COURSE DATA]`);

console.log(courseHeader.description); // > Spin at 30% FTP for a few minutes, then two back to back sprints and easy spin again.
console.log(courseData[0]); // > [0, 30]

// Transform back to .mrc
const mrc = MRC.stringify({ courseHeader, courseData });
```

## File Format

The difference between `.erg` and `.mrc` is that `.erg` always contains all information required to execute the workout, while `.mrc` can be supplied with information, like FTP during execution time. Because of this, when using `.erg` you should either use `WATTS` as unit of course data or provide the `FTP` field, as seen in examples in [files folder](./files).

## Development

Install dependencies:

```sh
npm install
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
