# Case Study: Purple Cross Ltd

## Overview

Purple Cross Ltd, a pharmaceutical company, has recently joined us as a client. As part of their onboarding, your Product Owner has assigned you a new JIRA ticket.

The goal is to build a centralized employee management dashboard that allows Purple Cross Ltd to view and edit their employees’ confidential information. For development

purposes, they’ve provided a JSON file containing sample employee data.

## Why We’re Doing This

Purple Cross Ltd currently manages their 200+ employees using a simple Excel sheet. By integrating them into our SaaS product under the “Employee Management” module, we’ll provide them with a scalable and user-friendly solution to manage, monitor, and maintain their employee records more efficiently.

## Acceptance Criteria

Index Page

The index page should include:

1. Employee Grid/Table

    - Each row should display:

        - Employee Full Name

        - Occupation

        - Department

        - Date of Employment

            - Future dates should display as “Employed soon”

            - Past dates should display as “Currently employed”

        - Termination Date

            - Future dates should display as “To be terminated”

            - Past dates should display as “Terminated”

    - Each row should also include action buttons:

        - View – Opens the employee’s profile.

        - Edit – Opens the employee’s profile in edit mode.

        - Delete – Opens a confirmation dialog; if confirmed, removes the employee from the list.

    - The grid should be filterable and sortable.

2. Create Employee Button

    - Positioned at the bottom-right corner of the page.


    - Clicking it should open a form allowing users to create a new employee and add them to the list.

## Create Employee Form

The “Create Employee” form should include:

- Input fields for all employee details.

- Two buttons at the bottom:

    - Save – Saves the new employee.

    - Cancel – Returns to the index page without saving.

- Required fields:

    - Code

    - Full Name

    - Occupation

    - o Department

- Appropriate validation must be implemented for all fields.

## Specifications

1. The candidate has 5 days to complete this case study.

2. Sample employee data will be provided in a JSON file.

3. Only front-end development is required.

4. The solution must be responsive and adapt to different devices.

5. The application must be built using Vue.js.

6. CSS styling and third-party libraries are up to your discretion.

7. Commit your code to a public GitHub repository with clear, regular commits (not just one at the end).

8. Include appropriate validation and error handling.

9. Use comments in your code where helpful.

## Nice-to-Have Features

- UI enhancements such as a navigation bar, task bar, or logged-in user badge.

- Pagination and lazy loading in the employee grid.

- Import and export functionality for employee data.
