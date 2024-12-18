variable "key_name" {
  description = "Nombre de la llave SSH para acceder a la instancia"
  default = "digiturno"
}

variable "github_frontend_repo" {
  description = "URL del repositorio del frontend en GitHub"
  default     = "https://github.com/jrdeavila/digiturno-front.git"
}

variable "github_backend_repo" {
  description = "URL del repositorio del backend en GitHub"
  default     = "https://github.com/jrdeavila/digiturno.git"
}

variable "email" {
  description = "Email para el registro de la aplicación"
  default     = "desarrolladores@ccvalledupar.org.co"
}

variable "domain" {
  description = "Dominio para el certificado SSL"
  default     = "dev.digiturno.ccvalledupar.org.co"
}