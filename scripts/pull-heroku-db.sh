heroku pg:backups:capture --app apollos-church-api
heroku pg:backups:download --app apollos-church-api
pg_restore --verbose --clean --no-acl --no-owner -h localhost -d postgres latest.dump
rm latest.dump