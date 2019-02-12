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
  description = "Your app's name. Name must start with a letter, end with a letter or digit and can only contain lowercase letters, digits, and dashes."
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
    ENGINE_API_KEY = "your engine api key (optional)"
    ROCK_TOKEN = "the token for your rock api user"
    ONE_SIGNAL_REST_KEY = "your one signal REST API key (different than the API key included on the client)"
  }

  stack = "container"
}

resource "heroku_addon" "cloudinary" {
  app  = "${heroku_app.default.name}"
  plan = "cloudinary"
}

# Comment out the following lines to enable CDN creation
resource "heroku_addon" "fastly" {
  app  = "${heroku_app.default.name}"
  plan = "fastly:quick"
}
