resource "aws_autoscaling_group" "ecs_asg" {
  launch_template {
    id      = aws_launch_template.ecs_instance.id
    version = "$Latest"
  }

  min_size         = 1
  max_size         = 3
  desired_capacity = 2

  vpc_zone_identifier = var.subnet_ids

  health_check_type         = "EC2"
  health_check_grace_period = 0

  tag {
    key                 = "Name"
    value               = "ECS Instance for CA_Project"
    propagate_at_launch = true
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_autoscaling_policy" "scale_up" {
  autoscaling_group_name = aws_autoscaling_group.ecs_asg.name
  name                   = "scale-up"
  scaling_adjustment     = 1
  adjustment_type        = "ChangeInCapacity"
  cooldown               = 300
}

resource "aws_autoscaling_policy" "scale_down" {
  autoscaling_group_name = aws_autoscaling_group.ecs_asg.name
  name                   = "scale-down"
  scaling_adjustment     = -1
  adjustment_type        = "ChangeInCapacity"
  cooldown               = 300
}
