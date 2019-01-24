# Configure the Heroku provider

variable "heroku_email" {
  type = "string"
  description = "Your Heroku Email"
}

variable "heroku_api_key" {
  type = "string"
  description = "Your Heroku API key (find it in your Heroku account settings)"
}

variable "app_name" {
  type = "string"
  description = "Your app's name"
}


provider "heroku" {
  email   = "${var.heroku_email}"
  api_key = "${var.heroku_api_key}"
}

# Create a new application
resource "heroku_app" "default" {
  region = "us"
  name = "${var.app_name}"

  config_vars {
    BIBLE_API_KEY = "your bible.api key"
    CLOUDINARY_URL = "your cloudinary url (optional)"
    ENGINE_API_KEY = "your engine api key (optional)"
    ROCK_TOKEN = "the token for your rock api user"
  }

  stack = "container"
}

