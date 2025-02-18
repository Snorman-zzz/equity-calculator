# Equity Calculator

This application is designed to help teams manage and calculate the equity allocation across various team members, pools, and contribution areas. It includes several components such as workspaces, team details, member management, and reports generation. This system also supports tracking contributions and creating visual reports, including pie charts, for better equity distribution transparency.

## Features

- **Workspaces**: Manage multiple workspaces, each containing team members, reserved equity pools, contribution areas, and intangible factors.
- **Team Details**: View and manage team details within a workspace, including member equity distribution across various pools and areas.
- **Member Management**: Add, edit, and remove team members, as well as manage their equity allocations.
- **Reports**: Generate detailed reports on team equity, including pie charts and a CSV export option.
- **Validation**: Ensure the equity distribution is accurate and meets the required conditions (total equity equals 100%, no empty categories, etc.).
- **Customizable**: Users can add custom equity pools, areas, and intangible factors to the workspace.
  
## Prerequisites

Before you start, you need to have the following tools installed:

- Node.js (preferably v16 or higher)
- npm (Node Package Manager)

## Installation

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/yourusername/equity-calculator.git
    cd equity-calculator
    ```

2. **Install Dependencies**:
    ```bash
    npm install
    ```

3. **Run the Application**:
    ```bash
    npm start
    ```

The application will be running at `http://localhost:3000` in your browser.

## File Structure

```bash
.
├── App.js                  # Main app component, includes routing
├── TeamContext.js          # Context for managing workspaces and equity data
├── TeamDetailsPage.js      # Page displaying workspace team details
├── NewMemberPage.js        # Page for adding or editing a team member
├── ValidationModal.js      # Modal for validating team data
├── ReportsPage.js          # Page for generating and displaying reports
├── WorkspacesPage.js       # Page for managing multiple workspaces
├── TopBar.js               # Navigation bar for the app
├── SliderWithButtons.js    # Custom slider component for equity allocation
├── styles.css              # Global styles for the app
└── SliderWithButtons.css   # Styles for the slider component
```

## How to Use

### Workspaces

- You can create and manage multiple workspaces by clicking the "Add Workspace" button on the **WorkspacesPage**.
- Each workspace represents a team or project that can contain members, contribution areas, and reserved equity pools.

### Team Details

- The **TeamDetailsPage** allows you to view and manage the team members, contribution areas, intangible factors, and equity pools.
- You can edit each member's contributions, add new areas/factors, and adjust weights to ensure equity is properly allocated.

### Reports

- On the **ReportsPage**, you can view a pie chart breakdown of the equity distribution across the project or among team members.
- The page also allows you to search for team members and export the equity report to CSV for further analysis.
- The **AI Report** feature will generate a detailed analysis of the equity distribution based on the current data.

### Member Management

- You can add new members through the **NewMemberPage** and assign equity contributions across different areas and intangible factors.
- Edit or delete members directly from the **TeamDetailsPage**.

### Validation

- The system validates the equity allocation, ensuring that the total allocation is 100%, no area/factor is left unassigned, and no member has zero equity.
- The **ValidationModal** will show any errors and allow you to review and fix them before saving the changes.

## Technologies Used

- **React**: Front-end framework for building the user interface.
- **Chart.js**: Used for rendering pie charts to visualize equity distribution.
- **React Router**: Handles navigation and routing within the app.
- **LocalStorage**: Used for persistent data storage across sessions.

## Contributing

We welcome contributions! If you would like to contribute to this project, follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add new feature'`)
5. Push to the branch (`git push origin feature-branch`)
6. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
