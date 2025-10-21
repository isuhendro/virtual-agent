# Husky Pre-Commit Hooks Setup

## Overview

Both `nextjs-agent` and `svelte-wrapper` projects are configured with Husky pre-commit hooks to enforce code quality standards and prevent long files from being committed.

## Configuration

### Root Level (.husky/pre-commit)

The main pre-commit hook is located at the repository root and runs hooks for both projects:

```bash
.husky/pre-commit
```

This hook:
- Runs lint-staged for nextjs-agent
- Runs lint-staged for svelte-wrapper
- Automatically fixes linting issues
- Formats code with Prettier
- Blocks commits if file size limits are exceeded

## Next.js Agent Configuration

### File Size Limits

Configured in `nextjs-agent/eslint.config.mjs`:

| Rule | Limit | Exclusions |
|------|-------|------------|
| **max-lines** | 300 lines per file | Blank lines, comments |
| **max-lines-per-function** | 100 lines per function | Blank lines, comments |
| **complexity** | 10 (cyclomatic complexity) | - |
| **max-depth** | 4 nested callbacks | - |
| **max-params** | 5 function parameters | - |

### Lint-Staged Configuration

Located in `nextjs-agent/package.json`:

```json
"lint-staged": {
  "*.{ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{js,jsx,json,css,md}": [
    "prettier --write"
  ]
}
```

### Scripts Available

```bash
npm run lint          # Check for linting issues
npm run lint:fix      # Fix linting issues automatically
npm run format        # Format code with Prettier
npm run type-check    # TypeScript type checking
```

## Svelte Wrapper Configuration

### File Size Limits

Configured in `svelte-wrapper/eslint.config.js`:

| Rule | Limit | Exclusions |
|------|-------|------------|
| **max-lines** | 300 lines per file | Blank lines, comments |
| **max-lines-per-function** | 100 lines per function | Blank lines, comments |
| **complexity** | 10 (cyclomatic complexity) | - |
| **max-depth** | 4 nested callbacks | - |
| **max-params** | 5 function parameters | - |

### Lint-Staged Configuration

Located in `svelte-wrapper/package.json`:

```json
"lint-staged": {
  "*.{ts,js,svelte}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{json,css,md}": [
    "prettier --write"
  ]
}
```

### Scripts Available

```bash
npm run lint          # Check for linting issues
npm run lint:fix      # Fix linting issues automatically
npm run format        # Format code with Prettier
npm run check         # Svelte component validation
npm run check:watch   # Watch mode for Svelte validation
```

## How It Works

### When You Commit

1. **Stage your changes:**
   ```bash
   git add .
   ```

2. **Attempt to commit:**
   ```bash
   git commit -m "Your commit message"
   ```

3. **Husky pre-commit hook runs automatically:**
   - Checks all staged files in both projects
   - Runs ESLint with auto-fix
   - Runs Prettier to format code
   - **Blocks commit if:**
     - Any file exceeds 300 lines (excluding blank lines/comments)
     - Any function exceeds 100 lines (excluding blank lines/comments)
     - Cyclomatic complexity exceeds 10
     - Nesting depth exceeds 4 levels
     - Function has more than 5 parameters

4. **If checks pass:**
   - Code is automatically formatted
   - Commit proceeds successfully

5. **If checks fail:**
   - Commit is blocked
   - Error messages show which files/rules failed
   - You must fix the issues before committing

## Example Output

### Successful Commit
```bash
$ git commit -m "Add new feature"
Running pre-commit hooks for nextjs-agent...
✔ Preparing lint-staged...
✔ Running tasks for staged files...
✔ Applying modifications from tasks...
✔ Cleaning up temporary files...
[main abc1234] Add new feature
 3 files changed, 45 insertions(+), 12 deletions(-)
```

### Blocked Commit (File Too Long)
```bash
$ git commit -m "Add large component"
Running pre-commit hooks for nextjs-agent...
✖ Running tasks for staged files...
  ✖ eslint --fix:

/Users/user/project/nextjs-agent/src/components/LargeComponent.tsx
  1:1  error  File has too many lines (325). Maximum allowed is 300  max-lines

✖ 1 problem (1 error, 0 warnings)

✖ lint-staged failed
```

## Fixing Common Issues

### File Too Long (>300 lines)

**Solution:** Break the file into smaller, focused modules

```typescript
// Before: LargeComponent.tsx (400 lines)

// After: Split into multiple files
// - LargeComponent.tsx (main component, 150 lines)
// - LargeComponent.utils.ts (helper functions, 80 lines)
// - LargeComponent.types.ts (type definitions, 50 lines)
// - LargeComponent.styles.ts (styling constants, 40 lines)
```

### Function Too Long (>100 lines)

**Solution:** Extract sub-functions or use composition

```typescript
// Before: One large function
function processData(data) {
  // 150 lines of logic
}

// After: Smaller, focused functions
function validateData(data) { /* 30 lines */ }
function transformData(data) { /* 40 lines */ }
function saveData(data) { /* 25 lines */ }

function processData(data) {
  const validated = validateData(data);
  const transformed = transformData(validated);
  return saveData(transformed);
}
```

### Complexity Too High (>10)

**Solution:** Simplify conditional logic, extract functions

```typescript
// Before: High complexity
function calculatePrice(item, user, discount, season) {
  if (item.type === 'premium') {
    if (user.isPremium) {
      if (discount > 0.5) {
        if (season === 'holiday') {
          // ... complex nested logic
        }
      }
    }
  }
}

// After: Lower complexity
function isPremiumEligible(item, user) { /* ... */ }
function applyDiscount(price, discount) { /* ... */ }
function applySeasonalPricing(price, season) { /* ... */ }

function calculatePrice(item, user, discount, season) {
  let price = item.basePrice;
  if (isPremiumEligible(item, user)) {
    price = applyDiscount(price, discount);
  }
  return applySeasonalPricing(price, season);
}
```

## Bypassing Hooks (Not Recommended)

In rare cases where you need to bypass the hooks:

```bash
git commit --no-verify -m "Emergency fix"
```

**⚠️ Warning:** Only use `--no-verify` for emergencies. Bypassing hooks defeats their purpose and can introduce technical debt.

## Troubleshooting

### Hooks Not Running

1. Check if Husky is installed:
   ```bash
   ls -la .husky/
   ```

2. Ensure hook is executable:
   ```bash
   chmod +x .husky/pre-commit
   ```

3. Verify Husky is installed in both projects:
   ```bash
   cd nextjs-agent && npm list husky
   cd ../svelte-wrapper && npm list husky
   ```

### ESLint Errors Persist

1. Run lint manually to see full errors:
   ```bash
   cd nextjs-agent && npm run lint
   cd ../svelte-wrapper && npm run lint
   ```

2. Fix issues and try again:
   ```bash
   npm run lint:fix
   ```

### Prettier Conflicts

If Prettier and ESLint conflict:

1. Format first with Prettier:
   ```bash
   npm run format
   ```

2. Then fix ESLint issues:
   ```bash
   npm run lint:fix
   ```

## Best Practices

1. **Commit frequently** - Small, focused commits are easier to review and less likely to hit file size limits

2. **Run linters before committing** - Catch issues early:
   ```bash
   npm run lint:fix
   npm run format
   ```

3. **Keep files focused** - Each file should have a single responsibility

4. **Extract utilities** - Move reusable functions to separate utility files

5. **Use composition** - Build complex components from smaller, simpler ones

6. **Write readable code** - Complexity limits encourage clearer logic

## Files Modified

### Root
- `.husky/pre-commit` - Main pre-commit hook

### nextjs-agent
- `package.json` - Scripts and lint-staged config
- `eslint.config.mjs` - ESLint rules including file size limits
- `.prettierrc` - Prettier configuration

### svelte-wrapper
- `package.json` - Scripts and lint-staged config
- `eslint.config.js` - ESLint rules including file size limits
- `.prettierrc` - Prettier configuration with Svelte plugin

## Benefits

✅ **Prevent technical debt** - File size limits encourage modular code
✅ **Maintain code quality** - Automatic formatting and linting
✅ **Consistent style** - Prettier ensures uniform code style
✅ **Better code reviews** - Smaller files are easier to review
✅ **Reduced complexity** - Complexity limits improve maintainability
✅ **Faster builds** - Smaller modules compile faster
✅ **Team alignment** - Everyone follows the same standards


---

## Important: Husky Location

⚠️ **Husky hooks are ONLY at the repository root level**

```
virtual-agent/              ← Git repository root
├── .husky/                 ← ✅ Husky hooks HERE
│   └── pre-commit          ← Main hook that runs both projects
├── nextjs-agent/           ← Subdirectory (NO .husky here)
│   ├── package.json        ← Has "prepare": "husky" script
│   └── ...
└── svelte-wrapper/         ← Subdirectory (NO .husky here)
    ├── package.json        ← Has lint-staged config
    └── ...
```

### Why Only at Root?

1. **Git repository is at root** - Husky hooks must be in the `.git` repository folder
2. **Single source of truth** - One hook manages all projects
3. **Simpler management** - Update hooks in one place
4. **Prevents conflicts** - No duplicate or conflicting hooks

### How the "prepare" Script Works

Both `nextjs-agent/package.json` and `svelte-wrapper/package.json` have:

```json
"scripts": {
  "prepare": "husky"
}
```

This script runs automatically when you do `npm install` and:
- Installs git hooks from the root `.husky/` folder
- Does NOT create a `.husky/` folder in the subdirectory
- Points to the root repository's hooks

### Verifying Correct Setup

Check that Husky is only at root:

```bash
# Should exist
ls -la .husky/

# Should NOT exist
ls -la nextjs-agent/.husky/   # Should show "No such file or directory"
ls -la svelte-wrapper/.husky/ # Should show "No such file or directory"
```

If you accidentally have `.husky` folders in subdirectories, remove them:

```bash
rm -rf nextjs-agent/.husky/
rm -rf svelte-wrapper/.husky/
```
