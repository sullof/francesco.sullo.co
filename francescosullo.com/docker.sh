docker run --name francescosullo-com \
  -p 8040 \
  --restart unless-stopped \
  -e VIRTUAL_HOST=francescosullo.com,www.francescosullo.com \
  -e LETSENCRYPT_HOST=francescosullo.com,www.francescosullo.com \
  -e LETSENCRYPT_EMAIL=francescosullo@sameteam.co \
  -v ./html:/usr/share/nginx/html:ro -d nginx
