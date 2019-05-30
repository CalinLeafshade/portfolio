workflow "New workflow" {
  on = "push"
  resolves = ["docker://calinleafshade/s3-website-docker:latest"]
}

action "GitHub Action for npm" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "install"
}

action "GitHub Action for npm-1" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["GitHub Action for npm"]
  args = "run build"
}

action "docker://calinleafshade/s3-website-docker:latest" {
  uses = "docker://calinleafshade/s3-website-docker:latest"
  needs = ["GitHub Action for npm-1"]
  secrets = ["AWS_SECRET_ACCESS_KEY", "AWS_ACCESS_KEY_ID"]
  args = "create"
}
