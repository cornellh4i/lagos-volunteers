<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/github_username/repo_name">
    <img src="/lfbi_logo.png" alt="Logo" width="200" height="80">
  </a>

<h3 align="center">Lagos Food Bank Initiative</h3>

  <p align="center">
    Lagos Food Bank Initiative is a non-profit organization that aims to reduce food waste and hunger in Lagos, Nigeria.
    <br />    
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About the Project

This project aims to develop a volunteer management system for Lagos Food Bank Initiative. The system will allow volunteers to sign up for shifts, and for LFBI to manage volunteers and hours.

### Built With

- [![Next][Next.js]][Next-url]
- [![React][React.js]][React-url]
- [![Express][Express.js]][Express-url]
- [![Postresql][Prisma.io]][Prisma-url]

<!-- GETTING STARTED -->

## Getting Started

> Folder structure

    .
    ├── frontend      # Next.js client
    ├── backend       # Express server
    └── README.md

### Prerequisites

- Nodejs
- PostreSQL
- Docker

### Installation

1. Install Docker
    - [Install Docker Desktop for macOS](https://docs.docker.com/desktop/install/mac-install/)
    - [Install Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)

2. Install Dev Containers
    - In VS Code, install the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

3. Clone the Git repository

   ```sh
   git clone https://github.com/cornellh4i/lagos-volunteers.git
   ```

4. Open the repository in VS Code. A button should appear in the bottom right corner asking to reopen the folder in a Dev Container. Click **Yes**.

5. Add necessary environment variables. The following files should be filled out: `/backend/.env` and `/frontend/.env.local`

3. Start the client and server
   ```sh
   # Run yarn setup in the root folder to build both the backend and the frontend
   yarn setup

   # Run yarn start in the root folder to start both the backend and the frontend
   yarn start

   # Run yarn test in the root folder to run Jest tests for the backend
   yarn test
   ```

> Note: See individual project files for more information on how to build and deploy the project.

## Contributors

### Fall 2024
- Akinfolami Akin-Alamu
- Jason Zheng

### Spring 2024

- Leads
  - Akinfolami Akin-Alamu
  - Jason Zheng
- Developers
  - Arushi Aggarwal
  - Owen Chen
  - Hubert He
  - Trung-Nghia Le
  - Brandon Lerit
  - Diego Marques
  - Tanvi Mavani
  - David Valarezo

### Fall 2023

- Leads
  - Akinfolami Akin-Alamu
  - Jason Zheng
- Developers
  - Sneha Rajaraman
  - Daniel Thorne
  - Louis Valencia
  - Sophie Wang
  - Yichen Yao
  - Hannah Zhang
- Designers
  - Ella Keen Allee
  - Bella Besuud
  - Mika Labadan

### Spring 2023

- Leads
  - Akinfolami Akin-Alamu
  - Jason Zheng
- Developers
  - Jiayi Bai
  - Daniel Botros
  - Sneha Rajaraman
  - Sophie Wang
  - Yichen Yao
  - Hannah Zhang
- Designers
  - Bella Besuud
  - Mika Labadan
  - Julia Papp

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Prisma.io]: https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white
[Express.js]: https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB
[Express-url]: https://expressjs.com/
[Prisma-url]: https://www.prisma.io/
