# Contributing

When contributing to this repository, please explain your changes or additions in an issue or in the pull request. 

When developing, please:

* Comply with Standard JS. This is tested when you commit to natural.
* Prevent code duplication. Use jscpd to test this. This is tested when you commit to natural.
* Write unit tests for jasmine. Make sure your unit tests pass.
* For compatibility with browsers, do not use the file system fs. If you need to read files, use JSON and require.
* Write documentation and commit this to the gh-pages branch.
* The current configuration of the unit tests requires the following environment variable to be set:
```
    export NODE_PATH=.
```

# CD/CD pipeline
The repository uses Github Actions for testing and publishing.

Currently, there three workflows:

* Node CI: tests natural on the four most recent releases of Nodejs. Code coverage is analysed with Istanbul. Results are forwarded to Coveralls. In the README a badge shows the coverage.
* Nodejs package: The natural package is automatically published to NPM when a release is created (tagged).
* Lint Code Base: the repository is linted using the Github super linter which includes jslint and jscpd.
* CodeQL for detecting security vulnerabilities.
Github workflows can be found in the folder ./.github/workflows.

# Versioning
We apply semantic versioning. Given natural’s version number MAJOR.MINOR.PATCH, increment the:

* MAJOR version when you make incompatible API changes,
* MINOR version when you add functionality in a backwards compatible manner, and
* PATCH version when you make backwards compatible bug fixes.
