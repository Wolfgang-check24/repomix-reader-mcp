# Release Template

## Pre-Release Checklist

- [ ] All tests are passing
- [ ] Security checks are clean
- [ ] Documentation is up to date
- [ ] CHANGELOG is updated
- [ ] Version follows [SemVer](https://semver.org/)

## Release Types

### Patch Release (x.y.Z)
- Bug fixes
- Security patches
- Documentation updates

### Minor Release (x.Y.0)
- New features
- Non-breaking changes
- Deprecations

### Major Release (X.0.0)
- Breaking changes
- API changes
- Major new features

## Release Process

### Option 1: Automated Release (Recommended)
```bash
# Update version and create tag
npm version patch  # or minor/major
git push origin main --tags

# GitHub Actions will automatically:
# 1. Run security checks
# 2. Build the project
# 3. Publish to NPM
# 4. Create GitHub release
```

### Option 2: Manual Release
1. Go to GitHub Actions
2. Run "Manual Release" workflow
3. Specify version and options
4. Monitor the release process

## Post-Release

- [ ] Verify NPM package is published
- [ ] Check GitHub release is created
- [ ] Announce release if needed
- [ ] Update dependent projects
