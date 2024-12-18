output "instance_public_ip" {
  value = aws_instance.web_server.public_ip
}

output "instance_public_dns" {
  value = aws_instance.web_server.public_dns
}

output "website_url" {
  value = "http://${aws_instance.web_server.public_ip}"
}
