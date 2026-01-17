# Contributing to Stem Synergy

Thank you for your interest in contributing to Stem Synergy! We welcome contributions from the community.

## Code of Conduct

By participating in this project, you agree to abide by the [Code of Conduct](CODE_OF_CONDUCT.md).

## How to Contribute

### Reporting Bugs

Before creating bug reports, check the issue list. When creating a bug report, include:

- **Clear description** of what the bug is
- **Steps to reproduce** the behavior
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Your environment** (OS, browser, Node version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear description** of the enhancement
- **Use case** and benefits
- **Possible implementation** approach (optional)

### Pull Requests

1. **Fork the repository** and create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our code style:
   - Use TypeScript
   - Run `pnpm lint` and fix any issues
   - Add tests for new features
   - Update documentation

3. **Run tests** before submitting:
   ```bash
   pnpm lint
   pnpm type-check
   pnpm build
   pnpm test
   ```

4. **Commit with clear messages**:
   ```bash
   git commit -m "feat: add amazing feature"
   ```

5. **Push and create a Pull Request**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Request review** and respond to feedback

## Development Setup

```bash
# Clone repository
git clone https://github.com/jdrains110-beep/stem-synergy.git
cd stem-synergy

# Install dependencies
pnpm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
pnpm dev

# Run tests
pnpm test

# Run linter
pnpm lint
```

## Commit Message Conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: fix bug
docs: update documentation
style: formatting changes
refactor: code refactoring
test: add or update tests
chore: maintenance tasks
```

## Project Structure

- `app/` - Next.js app directory
- `components/` - React components
- `lib/` - Utilities and services
- `tests/` - E2E tests
- `public/` - Static assets

## Code Style

- TypeScript for all code
- Proper type annotations
- Meaningful variable names
- Comments for complex logic

## Performance Considerations

- Minimize bundle size
- Optimize images
- Use React.memo for expensive components
- Implement lazy loading where appropriate

## Security

- No hardcoded secrets
- Use environment variables
- Validate user input
- Follow OWASP guidelines
- Report security issues privately to maintainers

## Documentation

- Update README for significant changes
- Add JSDoc comments for functions
- Update CHANGELOG.md
- Provide examples for new features

## Need Help?

- 📖 Check documentation in the repo
- 💬 Open a discussion for questions
- 📧 Contact maintainers

---

Thank you for contributing to Stem Synergy! 🙏
