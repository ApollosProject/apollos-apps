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

variable "heroku_container_size" {
  type = "string"
  default = "free"
  description = "Heroku Container Size - The default is the only free container size. Other options are hobby, standard-1x, etc."
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

# resource "heroku_addon" "database" {
#   app  = "${heroku_app.default.name}"
#   plan = "heroku-postgresql:hobby-basic"
# }


resource "heroku_build" "default" {
  app = "${heroku_app.default.id}"

  source = {
    # A local directory, changing its contents will
    # force a new build during `terraform apply`
    path = "./packages/apollos-church-api"
  }
}

resource "heroku_formation" "default" {
  app        = "${heroku_app.default.id}"
  type       = "web"
  quantity   = 1
  size       = "${var.heroku_container_size}"
  depends_on = ["heroku_build.default"]
}