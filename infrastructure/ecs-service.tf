resource "aws_ecs_service" "example_service" {
  name            = "CA_Project_test_tf"
  cluster         = aws_ecs_cluster.ecs_cluster.arn
  task_definition = "${aws_ecs_task_definition.CA_Project.family}:${max(aws_ecs_task_definition.CA_Project.revision)}"
  desired_count   = 1
  launch_type     = "EC2"

  #   network_configuration {
  #     subnets         = var.subnet_ids
  #     security_groups = [var.vpc_security_group_id]
  #   }
  force_new_deployment = true

  service_connect_configuration {
    enabled   = true
    namespace = "arn:aws:servicediscovery:eu-central-1:637423330216:namespace/ns-ehs7kynz2bsgnwwb"

    service {
      client_alias {
        dns_name = "frontend"
        port     = 80
      }
      port_name      = "frontend" // As defined in the task definition
      discovery_name = "frontend"
    }

    service {
      client_alias {
        dns_name = "backend"
        port     = 3000
      }
      port_name      = "backend"
      discovery_name = "backend"
    }
  }

  ordered_placement_strategy {
    type  = "spread"
    field = "attribute:ecs.availability-zone"
  }

  ordered_placement_strategy {
    type  = "spread"
    field = "instanceId"
  }
}
