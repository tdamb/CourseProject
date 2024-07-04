variable "frontend_image_uri" {
  description = "Docker image URI for the frontend service"
  type        = string
}

variable "backend_image_uri" {
  description = "Docker image URI for the backend service"
  type        = string
}

resource "aws_ecs_task_definition" "CA_Project" {
  family                   = "CA_Project"
  network_mode             = "bridge"
  execution_role_arn       = "arn:aws:iam::637423330216:role/ecsTaskExecutionRole"
  task_role_arn            = "arn:aws:iam::637423330216:role/TomasProjectDynamoDBAccess"
  requires_compatibilities = ["EC2"]
  cpu                      = "1024"
  memory                   = "922"

  container_definitions = jsonencode([
    {
      name          = "frontend"
      image         = var.frontend_image_uri
      cpu           = 307
      memory        = 410
      essential     = true
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
          protocol      = "tcp"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/CA_Project"
          "awslogs-create-group"  = "true"
          "awslogs-region"        = "eu-central-1"
          "awslogs-stream-prefix" = "ecs"
        }
      }
    },
    {
      name          = "backend"
      image         = var.backend_image_uri
      cpu           = 205
      memory        = 410
      essential     = false
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
          protocol      = "tcp"
        }
      ]
      environment = [
        {
          name  = "AWS_DEFAULT_REGION"
          value = "eu-central-1"
        },
        {
          name  = "TABLE_NAME"
          value = "Urls"
        }
      ]
    }
  ])
}
