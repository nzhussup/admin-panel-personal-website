# Admin Panel for Personal Website

[![Go](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)](https://go.dev)
[![Java](https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=java&logoColor=white)](https://www.java.com)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![React.js](https://img.shields.io/badge/React.js-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)](https://kubernetes.io)
[![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/features/actions)


## Overview

This is a full-stack web application that serves as an [**Admin Panel**](https://admin.nzhussup.com) for managing data on my [personal website](https://nzhussup.com). The project includes a **backend API**, **frontend interface**, and **infrastructure setup** to provide a seamless and secure experience. The core functionality of the Admin Panel includes **CRUD operations** for managing content in the central database, while the personal website consumes the data through GET requests to display it.

### Key Features:
- **Admin Panel**: Secure authentication with JWT and CRUD operations on the central database.
- **Data Delivery**: Delivers dynamic content fetched from the central database via API.
- **Dark Mode**: Toggleable theme for improved user experience.
- **Forms**: For easy data management (e.g., adding/editing content).
- **CI/CD Integration**: Continuous integration and deployment via GitHub Actions for smooth development and deployment.
- **Docker / Kubernetes**: For scalable and flexible approach of software development.

---

## Demo Collage

Here is a collage showcasing various features and pages of the Admin Panel and the Personal Website:

| ![Image 1](https://api.nzhussup.com/v1/album/2267ab33-35a7-4f3a-95ce-d18b0d826a28/004d5267-2fb9-40ba-a760-e42542fbee34.png)  | ![Image 2](https://api.nzhussup.com/v1/album/2267ab33-35a7-4f3a-95ce-d18b0d826a28/0d23c36f-aecf-47f2-b01d-35ae2b74a7f6.png) | ![Image 3](https://api.nzhussup.com/v1/album/2267ab33-35a7-4f3a-95ce-d18b0d826a28/109e3463-9dc3-45ea-adf2-a64f51be3fb1.png) |
| -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| ![Image 4](https://api.nzhussup.com/v1/album/2267ab33-35a7-4f3a-95ce-d18b0d826a28/5b586072-5377-4993-a759-9e8eaa434fa8.png)  | ![Image 5](https://api.nzhussup.com/v1/album/2267ab33-35a7-4f3a-95ce-d18b0d826a28/63e90e2b-8994-4387-a1bb-2467952084b1.png) | ![Image 6](https://api.nzhussup.com/v1/album/2267ab33-35a7-4f3a-95ce-d18b0d826a28/8623aafd-e6dd-4bb7-9d06-dbd01af9e9d7.png) |
| ![Image 7](https://api.nzhussup.com/v1/album/2267ab33-35a7-4f3a-95ce-d18b0d826a28/9524d151-e091-44eb-81da-91a14bb0cf1a.png)  | ![Image 8](https://api.nzhussup.com/v1/album/2267ab33-35a7-4f3a-95ce-d18b0d826a28/a59990d3-17cc-4f25-91b3-ebee09976cd3.png) | ![Image 9](https://api.nzhussup.com/v1/album/2267ab33-35a7-4f3a-95ce-d18b0d826a28/f4d27bc2-d4d8-47a3-9c5b-4e83c54b3670.png) |
| ![Image 10](https://api.nzhussup.com/v1/album/2267ab33-35a7-4f3a-95ce-d18b0d826a28/ff901dd8-181a-4581-9007-ca90fa7fbf1a.png) |                                                                                                                                 |                                                                                                                                 |

---

## Technologies Used

- **Backend**: Java, Spring Boot
  - Provides the backend logic for managing data and authentication.
  - JWT-based security for secure user login and access control.
- **Frontend**: JavaScript, React.js, Bootstrap, CSS
  - React.js for building dynamic user interfaces.
  - Bootstrap for responsive layout and UI components.
- **Infrastructure**: Docker, Kubernetes
  - Docker for containerizing the backend and frontend applications.
  - Kubernetes for orchestrating containers in a scalable and robust environment.
- **CI/CD**: GitHub Actions
  - Automates the build, test, and deployment process.
  - Ensures continuous integration and smooth deployment workflows.

---

## Project Structure

This project is divided into the following components:

1. **Backend**:
   - **Spring Boot API**: Provides routes for user authentication and CRUD operations on data.
   - **Security**: Implements JWT authentication to secure the routes and ensure authorized access to the Admin Panel.
  
2. **Frontend**:
   - **Admin Panel UI**: Built with React.js, this interface allows the admin to interact with the backend via RESTful APIs.
   - **Responsive Design**: Utilizing Bootstrap and custom CSS, the frontend ensures a smooth user experience across different devices.
  
3. **Infrastructure**:
   - **Docker**: Containers for the backend and frontend applications.
   - **Kubernetes**: Orchestration for managing deployments and ensuring scalability.
   - **CI/CD**: Automates building and deploying the application with GitHub Actions.

---

## Features

### 1. **Authentication**
- Secure login and user authentication using JWT (JSON Web Token).
- The system ensures only authorized users can access the Admin Panel.

### 2. **CRUD Operations**
- Create, Read, Update, and Delete (CRUD) functionality for managing the content stored in the database.

### 3. **Dark Mode**
- Toggleable dark mode to improve the user experience, especially in low-light environments.

### 4. **Forms**
- Interactive forms for adding and editing data in the database with validation.

### 5. **CI/CD**
- **GitHub Actions** for continuous integration and deployment ensures code is automatically tested and deployed to production when merged into the main branch.

### 6. **Responsive Layout**
- Built with Bootstrap, the Admin Panel is fully responsive, ensuring that the interface works well on mobile, tablet, and desktop devices.

---

## Installation & Setup

### Prerequisites:
- Kubernetes

Create secrets.yml and configmap.yml files
  
``` bash
git clone https://github.com/nzhussup/admin-panel-personal-website.git
cd admin-panel-personal-website/k8s
vim secrets.yml
vim configmap.yml
```

```bash
kubectl apply -f secrets.yml
kubectl apply -f configmap.yml
kubectl apply -f panel-api-deployment.yml
kubectl apply -f panel-frontend-deployment.yml
```

If no ingress and letsencrypt configured

```bash
cd COPY_ONLY
kubectl apply -f ingress.yml
kubectl apply -f letsencrypt_clusterissuer.yml
```

---

## CI/CD Pipeline

### GitHub Actions Configuration:
- Configuration files are located in the `.github/workflows` directory.
  
---

