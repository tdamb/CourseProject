terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 3.70" // Ensure this version supports 'service_connect_configuration'
    }
  }
}

provider "aws" {
  region = "eu-central-1"
}
