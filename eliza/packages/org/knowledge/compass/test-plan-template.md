# Test Plan Template

## Overview

Standard test plan template for the Compass agent, covering scope, test cases, platforms, devices, and pass/fail criteria.

## Test Plan Structure

### Header

```markdown
# Test Plan: [Feature Name]

**Version:** 1.0
**Author:** [Name]
**Date:** YYYY-MM-DD
**Status:** Draft | In Review | Approved
**Sprint/Release:** [Sprint # or Release #]
```

### 1. Scope

```markdown
## Scope

### In Scope
- [Feature 1]: Description of what will be tested
- [Feature 2]: Description of what will be tested
- [Feature 3]: Description of what will be tested

### Out of Scope
- [Related feature not being tested]
- [Backend changes handled by another team]
- [Third-party integrations tested separately]

### Assumptions
- Test environment mirrors production
- Test data is available and up to date
- All dependencies are deployed and accessible
- API documentation is current

### Risks
- [Risk 1]: [Mitigation]
- [Risk 2]: [Mitigation]
```

### 2. Test Cases

#### Happy Path

```markdown
## Happy Path Test Cases

| ID    | Description                     | Steps                              | Expected Result                    |
|-------|---------------------------------|------------------------------------|------------------------------------|
| HP-01 | User can create new account     | 1. Open app<br>2. Tap Sign Up<br>3. Fill form<br>4. Submit | Account created, redirected to home |
| HP-02 | User can log in with valid creds| 1. Open app<br>2. Enter email<br>3. Enter password<br>4. Tap Log In | Logged in, see dashboard           |
| HP-03 | User can edit profile           | 1. Go to profile<br>2. Tap Edit<br>3. Change name<br>4. Save | Profile updated, name changed      |
```

#### Edge Cases

```markdown
## Edge Case Test Cases

| ID    | Description                     | Steps                              | Expected Result                    |
|-------|---------------------------------|------------------------------------|------------------------------------|
| EC-01 | Submit form with empty fields   | 1. Leave all fields empty<br>2. Submit | Validation errors shown            |
| EC-02 | Submit form with max length     | 1. Enter 255 chars in name<br>2. Submit | Accepted or proper truncation      |
| EC-03 | Rapid double-tap on submit      | 1. Tap Submit twice quickly        | Single submission only             |
| EC-04 | Network disconnect during action | 1. Start action<br>2. Turn off WiFi<br>3. Complete | Error message, retry option        |
| EC-05 | Back button during form         | 1. Fill form<br>2. Press back<br>3. Return | Confirmation dialog or draft saved |
```

#### Error Cases

```markdown
## Error Case Test Cases

| ID    | Description                     | Steps                              | Expected Result                    |
|-------|---------------------------------|------------------------------------|------------------------------------|
| ER-01 | Invalid email format            | 1. Enter "notanemail"<br>2. Submit | Email validation error             |
| ER-02 | Weak password                   | 1. Enter "123"<br>2. Submit        | Password requirements shown        |
| ER-03 | Duplicate email registration    | 1. Enter existing email<br>2. Submit | Error: email already exists        |
| ER-04 | Server error (500)              | 1. Trigger server error<br>2. Check UI | User-friendly error message        |
| ER-04 | Session expired                 | 1. Wait for token expiry<br>2. Make request | Redirect to login                  |
```

### 3. Platforms

```markdown
## Platforms

### Mobile
- [ ] iOS 16+
- [ ] iOS 17+
- [ ] iOS 18+
- [ ] Android 12 (API 31)
- [ ] Android 13 (API 33)
- [ ] Android 14 (API 34)

### Web
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)

### Responsive
- [ ] iPhone SE (375x667)
- [ ] iPhone 15 (393x852)
- [ ] iPad (810x1080)
- [ ] Android Phone (360x800)
- [ ] Android Tablet (800x1280)
```

### 4. Devices

```markdown
## Device Matrix

### Physical Devices
| Device              | OS Version | Status      | Notes              |
|---------------------|------------|-------------|--------------------|
| iPhone 15 Pro       | iOS 17.4   | Primary     | Main iOS testing   |
| iPhone SE 3rd Gen   | iOS 16.5   | Secondary   | Small screen       |
| iPad Air 5          | iOS 17.2   | Optional    | Tablet layouts     |
| Pixel 7             | Android 14 | Primary     | Main Android       |
| Samsung Galaxy S23  | Android 13 | Secondary   | OEM variations     |
| Samsung Galaxy Tab S8| Android 13 | Optional    | Android tablet     |

### Simulators
| Simulator           | OS Version | Use Case                |
|---------------------|------------|-------------------------|
| iPhone 15 Pro       | iOS 17.4   | Quick iteration         |
| iPhone SE 3rd Gen   | iOS 16.5   | Small screen checks     |
| Pixel 7 API 34      | Android 14 | Quick iteration         |
```

### 5. Estimated Time

```markdown
## Time Estimates

| Phase                  | Hours | Dependencies           |
|------------------------|-------|------------------------|
| Test case creation     | 4     | Feature spec complete  |
| Environment setup      | 2     | Dev environment ready  |
| Test execution         | 8     | Build available        |
| Bug verification       | 4     | Bug fixes deployed     |
| Regression testing     | 6     | All fixes verified     |
| Documentation          | 2     | Testing complete       |
| **Total**              | **26**|                        |

### Timeline
- Day 1: Test case creation + environment setup
- Day 2-3: Test execution (happy path + edge cases)
- Day 4: Bug verification + error cases
- Day 5: Regression + documentation
```

### 6. Pass/Fail Criteria

```markdown
## Pass/Fail Criteria

### Release Criteria
- [ ] All critical (P0) test cases pass
- [ ] All high (P1) test cases pass
- [ ] No open P0 bugs
- [ ] No more than 3 open P1 bugs
- [ ] Code coverage >= 80%
- [ ] Performance benchmarks met
- [ ] Accessibility audit passed

### Test Case Priority
| Priority | Description                          | Required for Release |
|----------|--------------------------------------|---------------------|
| P0       | Core functionality, data integrity   | Yes                 |
| P1       | Important features, user flows       | Yes                 |
| P2       | Secondary features, edge cases       | Recommended         |
| P3       | Nice-to-have, cosmetic issues        | Optional            |

### Bug Severity
| Severity | Description                          | Fix Required        |
|----------|--------------------------------------|---------------------|
| Critical | Crash, data loss, security breach    | Before release      |
| Major    | Feature broken, no workaround        | Before release      |
| Minor    | Feature impaired, workaround exists  | Next sprint         |
| Trivial  | Cosmetic, typo, minor UI issue       | Backlog             |
```

### 7. Test Data

```markdown
## Test Data

### Accounts
| Account Type     | Email                    | Password     | Purpose              |
|------------------|--------------------------|--------------|----------------------|
| Admin            | admin@test.com           | Test123!     | Admin features       |
| Regular User     | user1@test.com           | Test123!     | Standard features    |
| New User         | newuser@test.com         | Test123!     | Onboarding flow      |
| Premium User     | premium@test.com         | Test123!     | Premium features     |

### Test Data Files
- Profile images: /test-data/images/
- Import files: /test-data/imports/
- Export templates: /test-data/templates/
```

### 8. Environment

```markdown
## Test Environment

| Environment | URL                        | Purpose           | Data          |
|-------------|----------------------------|-------------------|---------------|
| Development | https://dev.example.com    | Dev testing       | Synthetic     |
| Staging     | https://staging.example.com| Pre-release       | Production-like|
| QA          | https://qa.example.com     | Formal testing    | Test suite    |

### Access
- VPN required: Yes/No
- Authentication: [How to obtain test credentials]
```

### 9. Approval

```markdown
## Approval

| Role              | Name     | Date     | Status    |
|-------------------|----------|----------|-----------|
| QA Lead           |          |          | Pending   |
| Product Owner     |          |          | Pending   |
| Engineering Lead  |          |          | Pending   |
```
