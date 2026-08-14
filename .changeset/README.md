# Changesets

This folder contains metadata about version changes for the PulseGuard project. Changesets are used to track
and manage version bumps for packages within the monorepo. Each file in this directory represents a
single changeset that has been created by a developer to indicate what changed in a specific version bump.

## How Changesets Work

Changesets help maintain version consistency across the monorepo. When a developer makes changes that
affect a package's public API, they create a changeset file describing the changes. These files are
automatically collected and used by the Changesets CLI to:

1. Determine which packages need version updates
2. Calculate the correct new version numbers (major, minor, or patch)
3. Generate changelog entries for each package
4. Create a version commit and tag for version release

## Folder Structure

The `.changeset` folder contains the following:

- **Changelog files**: Markdown files describing the changes in each version bump
- **Summary files**: YAML files containing metadata about the changeset
- **Configuration**: `config.json` for Changesets CLI configuration

## Creating Changesets

To create a new changeset, use the `changeset add` command:

```bash
npx changeset add
```

This will prompt you to:

1. Choose the type of version bump (major, minor, or patch)
2. Select which packages are affected
3. Describe the changes in a summary

Changesets should be created for:

- Breaking API changes (major version)
- New features (minor version)
- Bug fixes (patch version)

## Example Changeset File

A typical changeset file looks like this:

```yaml
---
"@pulseguard/core": minor

"@pulseguard/worker": minor

---
## Added

- New API endpoint /auth/signup-invite for invite-based registration.

## Changed

- Updated @pulseguard/db schema to include invite tracking.
```

## Common Questions

### How do I update a changeset after creating it?

Simply run `npx changeset edit <filename>` to modify an existing changeset. You can change the version
type, affected packages, or the description.

### When should I create a changeset?

Create a changeset whenever you make changes that affect the public API of any package. This includes:

- Adding new functions or components
- Modifying function signatures
- Removing or deprecating APIs
- Fixing bugs that affect behavior

### What happens to changeset files after versioning?

Once a version is released, the changeset files are:

1. Moved to a `.changeset/awaiting-release` folder
2. Incorporated into the changelog for each affected package
3. Removed from the `.changeset` folder after the release commit is created

### Can I delete a changeset?

Yes, you can delete a changeset file if it was created by mistake or is no longer needed. Just remove
the file from the `.changeset` directory.

## Resources

- [Changesets Documentation](https://github.com/changesets/changesets)
