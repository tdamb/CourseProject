terraform {
  backend "s3" {
    bucket = "tfstatebucketca"
    key    = "state/path/terraform.tfstate"
    region = "eu-central-1"
  }
}
