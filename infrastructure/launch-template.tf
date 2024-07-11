resource "aws_launch_template" "ecs_instance" {
  name          = var.aws_launch_template_name
  image_id      = var.ami_id
  instance_type = var.instance_type
  key_name      = var.key_name

  vpc_security_group_ids = [var.vpc_security_group_id]

  user_data = base64encode(<<-EOF
                            #!/bin/bash
                            echo ECS_CLUSTER=${var.cluster_name} >> /etc/ecs/ecs.config
                            EOF
  )

  iam_instance_profile {
    name = aws_iam_instance_profile.ecs_instance.name
  }

  monitoring {
    enabled = false
  }
}

resource "aws_iam_instance_profile" "ecs_instance" {
  name = "ecs_instance_profile"
  role = aws_iam_role.ecs_instance_role.name
}

resource "aws_iam_role" "ecs_instance_role" {
  name = "ecs_instance_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
        Effect = "Allow"
        Sid    = ""
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_instance" {
  role       = aws_iam_role.ecs_instance_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role"
}
