variable "cluster_name" {
  description = "Name of the ECS cluster"
  type        = string
  default     = "CA_Project"
}

variable "aws_launch_template_name" {
  description = "Name of the ECS Launch template"
  type        = string
  default     = "ECSLaunchTemplate_CAProject"
}

variable "ami_id" {
  description = "AMI ID for the ECS instances"
  type        = string
  default     = "ami-0891d26d57c34edb2"
}

variable "instance_type" {
  description = "EC2 instance type for ECS instances"
  type        = string
  default     = "t2.micro"
}

variable "key_name" {
  description = "Key name to connect from laptop to ECS EC2 instance"
  type        = string
  default     = "NewClusterKeyPair"
}

variable "vpc_security_group_id" {
  description = "VPC security group"
  type        = string
  default     = "sg-0158b956c552cce1c"
}

variable "subnet_ids" {
  description = "List of Subnet IDs for the Auto Scaling Group"
  type        = list(string)
  default     = ["subnet-087199f55d5620633", "subnet-063c840d132f29f3e", "subnet-0ddf354cc1aac88db"]
}

variable "deployment_tag" {
  description = "Unique deployment identifier"
  type        = string
  default     = "CA_Project_Deployment"
}

variable "ecs_desired_count" {
  description = "Desired count for the ECS service"
  type        = number
  default     = 1
}

variable "asg_min_size" {
  description = "Minimum size of the Auto Scaling Group"
  type        = number
  default     = 1
}

variable "asg_max_size" {
  description = "Maximum size of the Auto Scaling Group"
  type        = number
  default     = 3
}

variable "asg_desired_capacity" {
  description = "Desired capacity of the Auto Scaling Group"
  type        = number
  default     = 1
}

