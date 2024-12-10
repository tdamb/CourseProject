# URL Shortener

This URL shortening functionality project is a small part of a larger project I have in mind. It aims to transform long, cumbersome URLs into concise, user-friendly versions, enhancing ease of sharing and management.

## Table of Contents

- [Introduction](#introduction)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
  - [Prerequisites](#prerequisites)
  - [Cloning the Repository](#cloning-the-repository)
  - [Backend Setup](#backend-setup)
    - [Installing Dependencies](#installing-dependencies)
    - [Running the Server](#running-the-server)
    - [Environment Variables](#environment-variables)
  - [Frontend Setup](#frontend-setup)
    - [Installing Dependencies](#installing-dependencies-1)
    - [Running the React App](#running-the-react-app)
- [CI/CD](#cicd)
  - [GitHub Actions Workflow](#github-actions-workflow)
- [Infrastructure](#infrastructure)
  - [ECS Service](#ecs-service)
  - [ECS Task Definition](#ecs-task-definition)
  - [Launch Template](#launch-template)
  - [Auto Scaling Group](#auto-scaling-group)
  - [Terraform Backend](#terraform-backend)
  - [ECS Cluster](#ecs-cluster)
- [Monitoring and Logging](#monitoring-and-logging)
- [Security](#security)
- [Application](#application)
- [Code Versioning](#code-versioning)
- [License](#license)

## Introduction

The URL Shortening functionality project aims to transform lengthy, cumbersome URLs into concise, user-friendly versions, enhancing ease of sharing and engagement. This component is part of a larger envisioned platform designed to improve digital interactions, with potential for advanced analytics and integration with broader systems.

## Technologies Used

- **AWS ECS**: Used for managing containerized applications.
- **AWS ECR**: Used for managing docker containers.
- **DynamoDB**: Database
- **AWS S3**: Used for storing Terraform state file.
- **Terraform**: Manages the infrastructure as code, provisioning and managing AWS resources.
- **Docker**: Containerization technology used to package and deploy applications.
- **GitHub Actions**: Automates workflows including CI/CD to build, test, and deploy code.

## Local Development Setup

This project uses Docker and Docker Compose to simplify dependency management and to streamline running the application locally. Below are the steps to get the application running locally using Docker Compose.

### Prerequisites

- Docker and Docker Compose installed on your machine.

### Running the Application

1. **Clone the repository:**

   ```bash
   git clone https://github.com/tdamb/CourseProject.git
   cd CourseProject
   ```

### Build and run the containers:

docker compose up --build

This command builds the Docker images for the frontend and backend if they don't exist and starts the services as defined in the docker compose.yml file. The frontend is accessible at http://localhost and the backend at http://localhost:3000.

### Stopping the Application

To stop the application, you can use the following Docker Compose command:

docker compose down

This command stops and removes the containers, networks, volumes, and images created by docker compose up.

## Backend Setup

### Environment Variables

You need to create a .env file in the backend directory. Populate it with the necessary AWS credentials and the DynamoDB table name as shown below:

AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_DEFAULT_REGION=your_region
TABLE_NAME=your_dynamodb_table_name
PORT=3000

These variables are necessary for the backend server to authenticate with AWS services and to specify the Dynamo
DB table used for operations. Ensure the .env file is placed in the root of the backend directory before starting the application with Docker Compose.

### Running the Backend Service

When running docker compose up, the backend service starts automatically. It is configured to restart if it exits due to errors or when the host system reboots.

## Frontend Setup

Running the Frontend Service
The frontend service also starts automatically upon executing docker compose up. It serves the React application on port 80, accessible via http://localhost. The frontend communicates with the backend via the configured network in Docker Compose, ensuring they can interact seamlessly.

## Making Changes

If you make changes to the frontend, Docker Compose will detect changes made to the files and will rebuild the image if necessary. For changes to take effect, you may need to manually rebuild the image using:

docker compose up --build

This ensures that the latest changes are included in the Docker image used to run the frontend service.

## CI/CD

### GitHub Actions Workflow

The GitHub Actions workflow automates the build, push, and deployment of Docker images to Amazon ECR and ECS. It includes:

Triggers on pushes and pull requests to the main branch.
Checks out the repository.
Configures AWS credentials.
Logs into Amazon ECR.
Sets date-time tags for Docker images.
Determines if there are code changes in the frontend or backend directories.
Builds and pushes Docker images if there are code changes.
Sets deployment tags.
Initializes and applies specific Terraform configurations.
Checks and scales the Auto Scaling Group.
Waits for new EC2 instances to be ready.
Applies the full Terraform configuration.
Scales down the Auto Scaling Group after deployment.

## Infrastructure

### ECS Service

The ECS Service (aws_ecs_service) manages the deployment of the application within the ECS cluster. It includes:

Service name: CA_Project_test_tf
Desired count: 1 (number of tasks to run)
Launch type: EC2
Placement strategies to distribute tasks across different availability zones and instances.
Service connect configuration to enable service discovery and client aliases for frontend and backend services.
Depends on the Auto Scaling Group (aws_autoscaling_group.ecs_asg) to ensure EC2 instances are available.

### ECS Task Definition

The ECS Task Definition (aws_ecs_task_definition) specifies the Docker containers that run as part of the ECS service. It includes:

Family name: CA_Project
Network mode: bridge
Execution role: ecsTaskExecutionRole
Task role: TomasProjectDynamoDBAccess
Requires compatibilities: EC2
CPU and memory allocations
Container definitions for frontend and backend services, including image URIs, CPU and memory settings, port mappings, and log configurations.

### Launch Template

The Launch Template (aws_launch_template) defines the EC2 instances that are part of the ECS cluster. It includes:

AMI ID, instance type, and key name for SSH access.
VPC security group.
User data script to configure ECS cluster.
IAM instance profile with the necessary role and policy attachment.
Tag specifications, including a DeploymentTag for tracking deployments.

### Auto Scaling Group

The Auto Scaling Group (aws_autoscaling_group) manages the EC2 instances that run the ECS tasks. It includes:

Minimum size: 1
Maximum size: 3
Desired capacity: 1
Health check settings.
Auto scaling policies for scaling up and down based on capacity.

### Terraform Backend

The Terraform backend configuration stores the Terraform state file in an S3 bucket. It includes:

Bucket: tfstatebucketca
Key: state/path/terraform.tfstate
Region: eu-central-1

### ECS Cluster

The ECS Cluster (aws_ecs_cluster) defines the ECS cluster where the services run. It includes:

Cluster name: CA_Project

### Monitoring and Logging

The ECS Task Definition includes log configurations for both frontend and backend containers. Logs are sent to AWS CloudWatch Logs with the log group /ecs/CA_Project and stream prefix ecs. This setup enables centralized logging and monitoring of the application.

### Security

The project uses IAM roles and policies to manage permissions securely. Key security configurations include:

IAM instance profile and roles for EC2 instances running ECS tasks.
Execution role and task role for ECS tasks.
VPC security group for EC2 instances.

### Application

The application includes frontend and backend services deployed on ECS. Key features include:

URL shortening functionality.
REST APIs for creating and retrieving shortened URLs.
Frontend built with React.
Backend built with Node.js and Express, using DynamoDB for storage.
Environment variables for configuration, such as AWS region and DynamoDB table name.

### Code Versioning

The project uses Git for version control, with the repository hosted on GitHub. The GitHub Actions workflow automates the CI/CD process, ensuring that the latest code changes are built, tested, and deployed efficiently.

## License

### Material-UI (MUI)

This project utilizes Material-UI components to enhance the UI design. MUI is a popular React UI framework that offers a comprehensive suite of UI tools to aid in building robust and attractive interfaces efficiently.

#### Licensing

MUI is available under the MIT license for the core components, which allows for free usage in commercial applications with no requirement to disclose the source code. The MIT license is permissive and simple, enabling broad usage across various types of projects.

If you are using any of MUI's premium components or themes (part of MUI X), be aware that these may require a commercial license, especially for use in production environments. For detailed information on licensing, including potential costs for commercial usage, please refer to the [MUI Pricing Page](https://mui.com/pricing/).

#### Compliance

Ensure that you comply with the licensing terms of all MUI components used within this project. If you modify any MUI components, note that the modified versions must also be shared under the same MIT license. Always refer to the original [MUI License Document](https://github.com/mui/material-ui/blob/master/LICENSE) for the most accurate licensing information.

```

```
